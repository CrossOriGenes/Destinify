# import pandas as pd
import os
from dotenv import load_dotenv
from bson import ObjectId, Decimal128
from datetime import datetime
import requests

load_dotenv()

UNSPLASH_KEY = os.getenv("UNSPLASH_ACCESS_KEY")


keywords = {
    "beach": [
        "goa", "andaman", "beach", "sea", "shore", "cove", "sandy", "sunset", "waves", "resort"
    ],
    "beaches": [
        "goa", "andaman", "beach", "sea", "shore", "cove", "sandy", "sunset", "waves", "resort"
    ],
    "mountain": [
        "mountain", "hill", "peak", "ridge", "snow", "valley", "glacier", "meadow",
        "manali", "leh", "kashmir", "nainital", "darjeeling"
    ],
    "mountains": [
        "mountain", "hill", "peak", "ridge", "snow", "valley", "glacier", "meadow",
        "manali", "leh", "kashmir", "nainital", "darjeeling"
    ],
    "heritage": [
        "temple", "fort", "palace", "heritage", "monument", "architecture", "museum", "agra", "jaipur", "khajuraho"
    ],
    "heritages": [
        "temple", "fort", "palace", "heritage", "monument", "architecture", "museum", "agra", "jaipur", "khajuraho"
    ],
    "adventure": [
        "trek", "rafting", "safari", "paragliding", "bungee", "rafting", "camping",
        "zipline", "climbing", "river rafting", "andaman", "himalayas"
    ],
    "adventures": [
        "trek", "rafting", "safari", "paragliding", "bungee", "rafting", "camping",
        "zipline", "climbing", "river rafting", "andaman", "himalayas"
    ],
    "city": [
        "delhi", "bengaluru", "mumbai", "chennai", "pune", "city", "urban", "nightlife",
        "shopping", "cafes", "restaurants", "architecture", "metro"
    ],
    "cities": [
        "delhi", "bengaluru", "mumbai", "chennai", "pune", "city", "urban", "nightlife",
        "shopping", "cafes", "restaurants", "architecture", "metro"
    ],
    "road-trip": [
        "highway", "drive", "scenic route", "rotang la", "khardung la", "leh", "manali",
        "valley road", "pass", "mountain road"
    ],
    "road-trips": [
        "highway", "drive", "scenic route", "rotang la", "khardung la", "leh", "manali",
        "valley road", "pass", "mountain road"
    ]
}


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
