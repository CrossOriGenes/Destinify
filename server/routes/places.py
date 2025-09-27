from flask import Blueprint, jsonify, request
import controllers.utils as ut
from models.place_model import Places


places_routes = Blueprint('places-routes', __name__)

# ================================
# GET PLACES BY CATEGORY
# ================================
@places_routes.route("/category/<string:categories>")
def get_places_by_category(categories):
    categ_list = categories.lower().split(",")
    page_count = int(request.args.get("count-request", 1))  # query param ?count-request=2
    limit = 25 if page_count == 1 else 8           

    # if categ not in ut.keywords:
    #     return jsonify({ "errMsg": "Invalid category!" }), 400
    if page_count > 3:
        return jsonify({ 
            "infoMsg": "Your Free plan expired, please switch to our premium plans for more benefits." 
        }), 403
    query = { "Category": { "$in": categ_list } } if len(categ_list) == 1 else { "Category": { "$all": categ_list } }
    # calculate slicing as per 3 pages max → free plan
    start = (page_count - 1) * limit
    cursor = Places.find(query).sort("Place_Rating", -1).skip(start).limit(limit)
    final_data = ut.formatted_data(list(cursor))
    total_matches = Places.count_documents(query)
    
    print("\nTotal-matches found: ", total_matches)
    return jsonify({
        "count": len(final_data),
        "total": total_matches,
        "places": final_data,
        "msg": "Recommendations fetched successfully"
    }), 200


# ================================
# GET PLACES BY NAME
# ================================
@places_routes.route("/place/<string:place>")
def get_places_by_name(place):
    place_name = place.capitalize()
    page_count = int(request.args.get("count-request", 1))  # query param ?count-request=2
    limit = 25 if page_count == 1 else 8           

    if not place_name:
        return jsonify({ "errMsg": "Missing place name!" }), 400
    if page_count > 3:
        return jsonify({ 
            "infoMsg": "Your Free plan expired, please switch to our premium plans for more benefits." 
        }), 403
    query = {
        "$or": [
            {"Place": {"$regex": place_name, "$options": "i"}},
            {"City": {"$regex": place_name, "$options": "i"}},
            {"Place_Desc": {"$regex": place_name, "$options": "i"}},
            {"City_Desc": {"$regex": place_name, "$options": "i"}},
        ]    
    }
    # calculate slicing as per 3 pages max → free plan
    start = (page_count - 1) * limit
    cursor = Places.find(query).sort("Place_Rating", -1).skip(start).limit(limit)
    final_data = ut.formatted_data(list(cursor))
    total_matches = Places.count_documents(query)
    
    print("\nTotal-matches found: ", total_matches)
    return jsonify({
        "count": len(final_data),
        "total": total_matches,
        "places": final_data,
        "msg": "Recommendations fetched successfully"
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
    
    return jsonify({
        "success": True,
        "data": {}
    }), 200