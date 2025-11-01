from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from schemas.user_schema import Users, Users_dummy
from neurals.travel_recommender_predict import predict_category
import controllers.utils as ut 


users_routes = Blueprint('users-routes', __name__)



# ==================================
# GET USER'S DATA (using Token)
# ==================================
@users_routes.route("/get_user")
def get_user_data():
    try:
        verify_jwt_in_request()
        email = get_jwt_identity()
        cursor = Users.find_one({ "email": email })
        data = ut.formatted_data([cursor])                
        return jsonify({ 
            "success": True, 
            "user": ut.serialize_user(data[0]) 
        })
    except Exception as e:
        return jsonify({ "success": False, "msg": str(e) }), 401


# ==================================
# GET USER'S DURATION PREDICTION (by preference & age)
# ==================================
@users_routes.route("/predict_duration", methods=['POST'])
def predict_duration():
    body = request.get_json()
    age = body.get("age")
    preferred_themes = body.get("preferred_themes")
    if not age or not preferred_themes or len(preferred_themes) == 0:
        return jsonify({
            "success": False, 
            "msg": "Age / preferences missing!",
            "description": "Both age and preferred categories are required to get suggestions." 
        }), 400    
    if not isinstance(age, int):
        return jsonify({
            "success": False, 
            "msg": "Invalid age!",
            "description": "Provided age is either invalid or not a proper number value!" 
        }), 400        
        
    result = predict_category(age, preferred_themes)
    
    return jsonify({
        "success": True,
        "msg": "place duration type predicted based on users age and preferences.",
        "result": result 
    })


# ==================================
# ADD PLACE TO WISHLIST 
# ==================================
@users_routes.route("/add_to_wishlist", methods=['POST'])
def update_wishlist():
    try:
        verify_jwt_in_request()
        email = get_jwt_identity()
        body = request.get_json()
        new_val = body.get("place_data")
        if not new_val:
            return jsonify({ "errMsg": "Data Unavailable!" }), 400
        result = Users.update_one(
            { "email": email },
            { "$addToSet": { "wishlist": new_val } }
        )
        if result.matched_count == 0:
            return jsonify({ "errMsg": "User not found!" }), 400
        
        return jsonify({
            "success": True,
            "msg": "Favs Updated...",
            "description": "Place successfully added to your Wishlist"
        })
    except Exception as e:
        return jsonify({ "success": False, "msg": str(e) }), 401
    

# ==================================
# UPDATE SEARCHLIST 
# ==================================
@users_routes.route("/update_searchlist", methods=['POST'])
def update_searchlist():
    try:
        verify_jwt_in_request()
        email = get_jwt_identity()
        body = request.get_json()
        new_val = body.get("placename")
        if not new_val:
            return jsonify({ "errMsg": "Data Unavailable!" }), 400
        result = Users.update_one(
            { "email": email },
            { "$addToSet": { "recent_searches": new_val } }
        )
        if result.matched_count == 0:
            return jsonify({ "errMsg": "User not found!" }), 400
        
        return jsonify({
            "success": True,
            "msg": "Recent-searches Updated...",
        })
    except Exception as e:
        return jsonify({ "success": False, "msg": str(e) }), 401
    

# ==================================
# UPDATE SEARCHLIST 
# ==================================
@users_routes.route("/update_preferred_themes", methods=['POST'])
def update_preferred_themes():
    try:
        verify_jwt_in_request()
        email = get_jwt_identity()
        body = request.get_json()
        new_val = body.get("category")
        if not new_val:
            return jsonify({ "errMsg": "Data Unavailable!" }), 400
        result = Users.update_one(
            { "email": email },
            { "$addToSet": { "preferred_themes": new_val } }
        )
        if result.matched_count == 0:
            return jsonify({ "errMsg": "User not found!" }), 400
        
        return jsonify({
            "success": True,
            "msg": "Preferred-themes list Updated...",
        })
    except Exception as e:
        return jsonify({ "success": False, "msg": str(e) }), 401


# ==================================
# GET USER'S MAIL (using Username)
# ==================================
@users_routes.route("/get_user_mail")
def get_user_email_by_name():
    u_name = request.args.get("u_name")
    if not u_name:
        return jsonify({ 
            "success": False, 
            "errMsg": "Username is required to reset password!"
        }), 400
    
    cursor = Users.find_one({ "username": u_name }, { "email": 1 })
    if not cursor:
        return jsonify({
            "success": False,
            "errMsg": "No records exists with this username!"
        }), 400
        
    return jsonify({ 
        "success": True, 
        "email": cursor['email'] 
    })

    
# =========================================
# TEST ROUTE
# =========================================
@users_routes.route("/test")
def test():
    cursor = list(Users_dummy.find({}).limit(10))
    users = ut.formatted_data(cursor)
    
    return jsonify({ 
        "success": True,
        "users": users,
        "size": len(cursor) 
    })