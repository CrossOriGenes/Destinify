# import pandas as pd
import os
from dotenv import load_dotenv
from bson import ObjectId, Decimal128
from datetime import datetime, timedelta
import requests

load_dotenv()

UNSPLASH_KEY = os.getenv("UNSPLASH_ACCESS_KEY")
CALENDARIFIC_API_KEY = os.getenv("CALENDARIFIC_API_KEY")
EVENTBRITE_TOKEN = os.getenv("EVENTBRITE_TOKEN")

# Helper: Unsplash se ek image fetch
def fetch_image(query):
    url = f"https://api.unsplash.com/search/photos?query={query}&per_page=1"
    headers = {"Authorization": f"Client-ID {UNSPLASH_KEY}"}
    try:
        r = requests.get(url, headers=headers)
        data = r.json()
        if "results" in data and len(data["results"]) > 0:
            return data["results"][0]["urls"]["regular"]
    except Exception as e:
        print("Image fetch error:", e)
    return None

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

# sort place-list by current month in ideal-months
def apply_month_filter(data):
    current_month = datetime.now().month
    filtered = []
    for place in data:
        best_time = place.get("Best_Time_To_Visit", [])
        # place["month_boost"] = current_month in best_time
        if current_month in best_time:
            place["month_boost"] = True
            filtered.append(place)
    # return sorted(data, key=lambda x: not x["month_boost"])
    return filtered

def apply_festival_boost(data, festival_place_ids):
    """
    Boost only those festival places which are already filtered in 'data'.
    """
    boosted = []
    normal = []
    for place in data:
        if str(place["_id"]) in festival_place_ids:
            boosted.append(place)
        else:
            normal.append(place)
    return boosted + normal
    
def get_current_festival_place_ids(city_names, places):
    """
    Combines Calendarific and Eventbrite data to find festivals/events for current date + 7 days.
    city_names: list of city names to check
    Returns list of place IDs that match festivals/events
    """
    today = datetime.now()
    end_date = today + timedelta(days=7)

    holiday_place_ids = fetch_holidays(today, end_date, places)
    event_place_ids = fetch_events(today, end_date, city_names, places)

    # Combine and remove duplicates
    combined_ids = list(set(holiday_place_ids + event_place_ids))
    valid_ids = set(str(p["_id"]) for p in places)
    combined_ids = [fid for fid in combined_ids if fid in valid_ids]
    return combined_ids

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
                # Example: you can map holiday to places by name matching or predefined list
                holiday_place_ids.extend(match_places_by_holiday(hol, places))
        return holiday_place_ids
    except Exception as e:
        print("Error fetching holidays:", e)
        return []

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

def match_places_by_holiday(holiday, places):
    """
    holiday: dict from Calendarific
    places: iterable of place docs (subset already filtered)
    Returns list of matching place IDs
    """
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