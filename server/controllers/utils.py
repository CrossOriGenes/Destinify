# import pandas as pd
import os
from dotenv import load_dotenv
from bson import ObjectId, Decimal128
from datetime import datetime, timedelta, timezone
import requests 
import re
import statistics


load_dotenv()

UNSPLASH_KEY = os.getenv("UNSPLASH_ACCESS_KEY")
CALENDARIFIC_API_KEY = os.getenv("CALENDARIFIC_API_KEY")
EVENTBRITE_TOKEN = os.getenv("EVENTBRITE_TOKEN")
GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")


# image fetcher for a particular place
def fetch_place_unsplash_photos(query, counts):
    url = f"https://api.unsplash.com/search/photos?query={query}&per_page={counts}"
    headers = {"Authorization": f"Client-ID {UNSPLASH_KEY}"}
    try:
        r = requests.get(url, headers=headers, timeout=10)
        r.raise_for_status()
        data = r.json()
        
        photos = []
        if "results" in data:
            for img in data["results"]:
                if "urls" in img and "regular" in img["urls"]:
                    photos.append(img["urls"]["regular"])
        
        return photos[:counts] if photos else []
    except Exception as e:
        print("Image fetch error: ", e)
        return []

# data formatter
def formatted_data(documents):   
    processed = []
    for doc in documents:
        new_doc = {}
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                new_doc[key] = str(value)
            elif isinstance(value, Decimal128):
                new_doc[key] = float(value.to_decimal())
            elif isinstance(value, datetime):
                new_doc[key] = value.isoformat()
            else:
                new_doc[key] = value
        processed.append(new_doc)
    return processed

# fetch a single image for a query
def fetch_1_unsplash_image(query):
    try:
        url = f"https://api.unsplash.com/search/photos?query={query}&per_page=1"
        headers = {"Authorization": f"Client-ID {UNSPLASH_KEY}"}
        r = requests.get(url, headers=headers, timeout=6)
        data = r.json()
        if "results" in data and len(data["results"]) > 0:
            return data["results"][0]["urls"]["regular"]
    except Exception as e:
        print("Unsplash image fetch error:", e)
    return "https://source.unsplash.com/800x600/?festival,india"

# fetch 3-4 festivals for a specific place
def fetch_festivals(city_name):
    try:
        url = "https://en.wikipedia.org/w/api.php"
        query = f"{city_name} festivals"
        params = {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "format": "json",
            "srlimit": 4,
        }
        headers = {"User-Agent": "TravelRecommender/1.0"}
        res = requests.get(url=url, params=params, headers=headers, timeout=6)
        if res.status_code != 200:
            return get_fallback_festivals(city_name)
        data = res.json().get("query", {}).get("search", [])
        if not data:
            return get_fallback_festivals(city_name)

        festivals = []
        for item in data[:4]:
            title = item.get("title", "Unknown Festival")
            snippet = item.get("snippet", "").replace("<span class=\"searchmatch\">", "").replace("</span>", "")
            img = fetch_1_unsplash_image(title)
            festivals.append({
                "title": title,
                "description": snippet or f"A popular festival of {city_name}.",
                "image": img,
                "place": city_name
            })
        return festivals or get_fallback_festivals(city_name)

    except Exception:
        return get_fallback_festivals(city_name)

# fallback festivals helper
def get_fallback_festivals(place_name):
    sample_data = [
        {
            "name": f"{place_name} Cultural Fest",
            "description": f"A vibrant local celebration showcasing {place_name}'s art, dance, and cuisine.",
            "location": place_name,
            "image": f"https://source.unsplash.com/random/800x600/?festival,{place_name}"
        },
        {
            "name": f"{place_name} Food Carnival",
            "description": f"A paradise for foodies visiting {place_name}, offering local delicacies and street flavors.",
            "location": place_name,
            "image": f"https://source.unsplash.com/random/800x600/?food,festival,{place_name}"
        },
        {
            "name": f"{place_name} Heritage Parade",
            "description": f"A cultural event honoring the traditions and history of {place_name}.",
            "location": place_name,
            "image": f"https://source.unsplash.com/random/800x600/?parade,{place_name}"
        },
    ]
    return sample_data

# Boost output-list by current festivals
def apply_festival_boost(data, festival_place_ids):
    boosted = []
    normal = []
    for place in data:
        if str(place["_id"]) in festival_place_ids:
            boosted.append(place)
        else:
            normal.append(place)
    return boosted + normal
    
# retrieve festivals place IDs
def get_current_festival_place_ids(city_names, places):
    today = datetime.now()
    end_date = today + timedelta(days=7)

    holiday_place_ids = fetch_holidays(today, end_date, places)
    event_place_ids = fetch_events(today, end_date, city_names, places)

    # Combine and remove duplicates
    combined_ids = list(set(holiday_place_ids + event_place_ids))
    valid_ids = set(str(p["_id"]) for p in places)
    combined_ids = [fid for fid in combined_ids if fid in valid_ids]
    return combined_ids

# fetch upcoming holidays
def fetch_holidays(start_date, end_date, places):
    url = "https://calendarific.com/api/v2/holidays"
    params = {
        "api_key": CALENDARIFIC_API_KEY,
        "country": "IN",
        "year": start_date.year,
        "month": start_date.month
    }
    try:
        res = requests.get(url, params=params)
        data = res.json()
        holidays = data.get("response", {}).get("holidays", [])
        holiday_place_ids = []
        for hol in holidays:
            date_str = hol.get("date", {}).get("iso", "")
            hol_date = datetime.fromisoformat(date_str) if date_str else None
            if hol_date and start_date <= hol_date <= end_date:
                holiday_place_ids.extend(match_places_by_holiday(hol, places))
        return holiday_place_ids
    except Exception as e:
        print("Error fetching holidays:", e)
        return []

# fetch upcoming events
def fetch_events(start_date, end_date, city_names, places):
    url = "https://www.eventbriteapi.com/v3/events/search/"
    headers = {"Authorization": f"Bearer {EVENTBRITE_TOKEN}"}
    event_place_ids = []

    for city in city_names:
        params = {
            "location.address": city,
            "start_date.range_start": start_date.isoformat(),
            "start_date.range_end": end_date.isoformat()
        }
        try:
            res = requests.get(url, headers=headers, params=params)
            data = res.json()
            events = data.get("events", [])
            for event in events:
                # direct mapping from event->places
                matches = match_places_by_event(event, places)
                event_place_ids.extend(matches)
        except Exception as e:
            print(f"Error fetching events for {city}:", e)

    return list(set(event_place_ids))  # unique IDs

# match places in db by retrieved holidays
def match_places_by_holiday(holiday, places):
    results = []
    name = holiday.get("name", "").lower()
    if not name:
        return results

    keywords = name.split()  # split holiday name into words
    for place in places:
        desc_text = " ".join([
            str(place.get("Place", "")),
            str(place.get("City", "")),
            str(place.get("Place_Desc", "")),
            str(place.get("City_Desc", ""))
        ]).lower()

        if any(kw in desc_text for kw in keywords):
            results.append(str(place["_id"]))  # ensure string ID
    return results

# match places in db by retrieved events
def match_places_by_event(event, places):
    # Match Eventbrite event with places by city/desc
    results = []
    city_name = event.get("venue", {}).get("address", {}).get("city", "")
    if not city_name:
        return results
    
    city_name = city_name.lower()
    for place in places:
        if str(place.get("City", "")).lower() == city_name:
            results.append(str(place["_id"]))
    return results

# fetch images of place from google places API
def fetch_place_google_photos(photo_refs, MAX):
    photo_urls = []
    for ref in photo_refs[:MAX]:
        try:
            url = (
                f"https://maps.googleapis.com/maps/api/place/photo"
                f"?maxwidth=1600&photo_reference={ref}&key={GOOGLE_PLACES_API_KEY}"
            )
            response = requests.get(url, allow_redirects=False)
            if response.status_code in (301, 302):
                photo_urls.append(response.headers.get("Location"))
        except Exception as e:
            print("Error fetching photo:", e)
    return photo_urls

# get aspect ratings of a place
def analyze_aspect_ratings(reviews):
    aspects = {
        "climate": ["weather", "heat", "cold", "climate", "temperature"],
        "food": ["food", "restaurant", "cuisine", "taste", "meal"],
        "transport": ["bus", "train", "car", "travel", "road", "transport"],
        "cleanliness": ["clean", "dirty", "hygiene", "neat"],
        "hospitality": ["people", "locals", "welcome", "friendly", "staff"]
    }
    scores = {key: [] for key in aspects}

    for review in reviews:
        text = review.get("text", "").lower()
        rating = review.get("rating", 0)
        if not text or not rating:
            continue
        for aspect, keywords in aspects.items():
            if any(re.search(rf"\b{k}\b", text) for k in keywords):
                scores[aspect].append(rating)
    aspect_ratings = {}
    for aspect, vals in scores.items():
        if isinstance(vals, (list, tuple)) and vals:
            aspect_ratings[aspect] = round(statistics.mean(vals), 1)
        else: 
            aspect_ratings[aspect] = 2.5
    
    return aspect_ratings

# fetch combined photos
def fetch_place_photos(place_name, photo_refs, existing_photos):
    photos = []
    google_photos = fetch_place_google_photos(photo_refs, 10)
    if google_photos:
        photos.extend(google_photos)
    if len(photos) < 19:
        unsplash_photos = fetch_place_unsplash_photos(place_name, 9)
        photos.extend(unsplash_photos)
    if existing_photos:
        photos.extend(existing_photos[:1])
    photos = list(dict.fromkeys(photos))
    photo_urls = photos[:20]    
    return photo_urls

# fetch reviews for a place
def fetch_google_reviews(place_name, existing_photos):
    search_url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
    params = {
        "input": place_name,
        "inputtype": "textquery",
        "fields": "place_id",
        "key": GOOGLE_PLACES_API_KEY
    }

    try:
        res = requests.get(search_url, params=params)
        data = res.json()
        candidates = data.get("candidates", [])
        if not candidates:
            print(f"No Google place found for: {place_name}")
            return None
        place_id = candidates[0]["place_id"]
        details_url = "https://maps.googleapis.com/maps/api/place/details/json"
        details_params = {
            "place_id": place_id,
            "fields": "name,photos,reviews,rating",
            "key": GOOGLE_PLACES_API_KEY
        }
        det_res = requests.get(details_url, params=details_params)
        det_data = det_res.json()
        result = det_data.get("result", {})
        google_rating = result.get("rating", 1)
        photos = result.get("photos", [])
        photo_refs = [p.get("photo_reference") for p in photos if p.get("photo_reference")]
        photo_urls = fetch_place_photos(place_name, photo_refs, existing_photos) if len(existing_photos) == 1 else existing_photos
        reviews = []
        for r in result.get("reviews", []):
            reviews.append({
                "author": r.get("author_name"),
                "profile_photo": r.get("profile_photo_url"),
                "rating": r.get("rating"),
                "text": r.get("text"),
                "time": r.get("relative_time_description")
            })
        aspect_ratings = analyze_aspect_ratings(reviews)
        mean_val = round(statistics.mean(aspect_ratings.values()), 1)
        overall_rating = max(mean_val, google_rating)
        
        return { 
            "reviews": reviews, 
            "photos": photo_urls, 
            "aspect_ratings": aspect_ratings, 
            "overall_rating": overall_rating
        }
            
    except Exception as e:
        print("Error fetching Google reviews:", e)
        return None

# fetch coordinates of a place
def get_coordinates(address: str):
    # print(address)
    url = f"https://maps.googleapis.com/maps/api/geocode/json"
    params = { "address": address, "key": GOOGLE_PLACES_API_KEY }
    res = requests.get(url, params=params).json()
    if res["status"] == "OK" and res["results"]:
        loc = res["results"][0]["geometry"]["location"]
        return loc["lat"], loc["lng"]
    return None, None

# fetch possible travel options according to source & destination
def get_route_options(origin, destination):
    url = "https://maps.googleapis.com/maps/api/directions/json"
    modes = ["driving", "train", "transit", "walking", "bicycling"]
    routes_data = []

    for mode in modes:
        params = {
            "origin": f"{origin[0]},{origin[1]}",
            "destination": f"{destination[0]},{destination[1]}",
            "mode": mode,
            "key": GOOGLE_PLACES_API_KEY
        }
        res = requests.get(url, params=params).json()

        if res["status"] == "OK" and res["routes"]:
            route = res["routes"][0]["legs"][0]
            polyline_points = res["routes"][0].get("overview_polyline", {}).get("points", None)
            dist_text = route["distance"]["text"]
            dur_text = route["duration"]["text"]
            dist_val = route["distance"]["value"] / 1000  # in km
            dur_val = route["duration"]["value"] / 3600  # in hours

            routes_data.append({
                "mode": mode.capitalize(),
                "distance": dist_text,
                "duration": dur_text,
                "distance_km": dist_val,
                "duration_hr": dur_val,
                "polyline": polyline_points
            })

    return routes_data

# Cost chart for various travel options
COST_TABLE = {
    "Driving": 8,
    "Train": 1.5,
    "Transit": 2.5,
    "Bicycling": 0,
    "Walking": 0,
}
# estimate cost and add to existing route options
def estimate_cost(routes_data, user_budget=None):
    for r in routes_data:
        cost = round(r["distance_km"] * COST_TABLE.get(r["mode"], 5))
        r["estimated_cost"] = cost
        if user_budget:
            r["within_budget"] = cost <= user_budget
    
    return sorted(routes_data, key=lambda x: x["estimated_cost"] if user_budget else x["duration_hr"])