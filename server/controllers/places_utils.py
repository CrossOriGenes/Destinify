import pandas as pd
import re
import ast
import os
import requests


UNSPLASH_KEY = os.getenv("UNSPLASH_ACCESS_KEY")

keywords = {
    "beach": ["beach", "sea", "coast"],
    "mountain": ["mountain", "hill", "peak"],
    "hike": ["mountain", "hill", "peak"],
    "heritage": ["temple", "fort", "palace", "heritage"],
    "adventure": ["trek", "rafting", "safari"],
    "city": ["city", "urban", "metropolis"],
    "road-trip": ["road", "highway", "drive"]
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

# reading dataset
df = pd.read_csv("data/india_places.csv")
