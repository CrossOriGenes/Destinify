from flask import Blueprint, jsonify, request

places_routes = Blueprint('places-routes', __name__)
        
# get recommendations list 
@places_routes.route("/get-places", methods=['POST'])
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
    

# get all places by category
@places_routes.route("/get-all-places/<string:category>")
def get_places_by_category(category):
    if not category:
        return jsonify({ 
            "success": False, 
            "errMsg": "Category doesn't exists!" 
        }), 400
        
    dummy_places = [
        {'id':"#1",'name':"Sikkim"},
        {'id':"#2",'name':"Darjeeling"},
        {'id':"#3",'name':"Gangtok"},
    ]
    return jsonify({
        "success": True,
        "places": dummy_places,
        "msg": f"Your recommendations on {category}"
    }), 200
    