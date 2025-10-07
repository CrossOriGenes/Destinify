# import pandas as pd
import os
from dotenv import load_dotenv
from bson import ObjectId, Decimal128
from datetime import datetime, timedelta
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

# def apply_month_filter(data):
#     current_month = datetime.now().month
#     filtered = []
#     for place in data:
#         best_time = place.get("Best_Time_To_Visit", [])
#         # place["month_boost"] = current_month in best_time
#         if current_month in best_time:
#             place["month_boost"] = True
#             filtered.append(place)
#     # return sorted(data, key=lambda x: not x["month_boost"])
#     return filtered

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
def fetch_place_google_photos(photo_refs, MAX=10):
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

# fetch reviews for a place
def fetch_google_reviews(place_name):
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
        photo_urls = fetch_place_google_photos(photo_refs)
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
