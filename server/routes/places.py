from flask import Blueprint, jsonify, request
import controllers.utils as ut
from models.place_model import Places

places_routes = Blueprint('places-routes', __name__)


# get all places by category
@places_routes.route("/category/<string:category>")
def get_places_by_category(category):
    categ = category.lower()
    page_count = int(request.args.get("count-request", 1))  # query param ?count-request=2
    limit = 25 if page_count == 1 else 8           

    if categ not in ut.keywords:
        return jsonify({ "errMsg": "Invalid category!" }), 400
      
    query = {
        "Place_Desc":{
            "$regex": "|".join(ut.keywords[categ]),  # keyword match using regex
            "$options": "i"  #case insensitive   
        }
    }
    cursor = Places.find(query).sort("Place_Rating", -1)
    all_results = list(cursor)
    total_matches = len(all_results)
    # calculate slicing as per 3 pages max → free plan
    start = (page_count - 1) * limit
    end = start + limit
    sliced = ut.formatted_data(all_results[start:end])  
    if page_count > 3:
        return jsonify({ 
            "errMsg": "Your Free plan expired, please switch to our premium plans for more benefits." 
        }), 403

    print("\nTotal-matches found: ", total_matches)
    return jsonify({
        "success": True,
        "count": len(sliced),
        "total": total_matches,
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
    cities = Places.find({"City": "Digha"})
    documents = list(cities)  
    data = ut.formatted_data(documents)  
    return jsonify({
        "success": True,
        "cities": data,
    }), 200