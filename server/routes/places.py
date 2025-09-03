from flask import Blueprint, jsonify, request
import pandas as pd
import numpy as np

places_routes = Blueprint('places-routes', __name__)

# reading data-frame
df = pd.read_csv('data/india_places.csv')


# get all places by category
@places_routes.route("/category/<string:category>")
def get_places_by_category(category):
    categ = category.lower()
    page_count = int(request.args.get("count-request", 1))  # query param ?count-request=2
    limit = 20 if page_count == 1 else 8           
    keywords = {
        "beach": ["beach", "sea", "coast"],
        "mountain": ["mountain", "hill", "peak"],
        "heritage": ["temple", "fort", "palace", "heritage"],
        "adventure": ["trek", "rafting", "safari"],
        "city": ["city", "urban", "metropolis"],
        "road-trip": ["road", "highway", "drive"]
    }
    if categ not in keywords:
        return jsonify({ "errMsg": "Invalid category!" }), 400
        
    mask = df["Place_Desc"].str.lower().str.contains(
        "|".join(keywords[categ]), na=False
    )
    results = df[mask].sort_values(by="City_Rating", ascending=False, na_position="last").to_dict(orient="records")
    # calculate slicing as per 3 pages max → free plan
    start = (page_count - 1) * limit
    end = start + limit
    sliced = results[start:end]  
    if page_count > 3:
        return jsonify({ 
            "errMsg": "Your Free plan expired, please switch to our premium plans for more benefits." 
        }), 403

    print("\nTotal-matches found: ", len(results))
    return jsonify({
        "success": True,
        "count": len(sliced),
        "data": sliced,
        "msg": f"Your recommendations on {category}"
    }), 200

            
# get recommendations list 
@places_routes.route("/recommend", methods=['POST'])
def get_place_recommendations():
    data = request.get_json()
    if not data:
        return jsonify({ 
            "success": False, 
            "errMsg": "Missing info!" 
        }), 400
    if not data.get("journey_date") or not data.get("return_date"):
        return jsonify({ 
            "success": False, 
            "errMsg": "Dates are missing!" 
        }), 400
        
    return jsonify({
        "success": True,
        "data": data
    })


# Test API
@places_routes.route("/test")
def test_route():
    results = df.Duration
    return jsonify({ 
        "success": True, 
        "data": list(results) 
    }), 200  