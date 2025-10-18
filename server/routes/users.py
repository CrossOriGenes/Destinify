from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from models.user_model import Users
import controllers.utils as ut 
import re

users_routes = Blueprint('users-routes', __name__)


# ==================================
# ADD PLACE TO WISHLIST 
# ==================================
@users_routes.route("/add_to_wishlist", methods=['POST'])
@jwt_required()
def update_wishlist():
    try:
        email = get_jwt_identity()
        if not email:
            return jsonify({ "success": False, "msg": "Token invalid or expired!" }), 401
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