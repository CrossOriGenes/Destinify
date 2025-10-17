from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from models.user_model import Users
import controllers.utils as ut 
import re

auth_routes = Blueprint('auth-routes', __name__)
bcrypt = Bcrypt()


# ==================================
# REGISTER USER (SIGNUP) 
# ==================================
@auth_routes.route("/signup", methods=['POST'])
def manual_signup():
    body = request.get_json()
    username = body.get("username")
    email = body.get("email")
    dob = body.get("dob")
    password = body.get("password")
    preferred_themes = body.get("preferred_themes", [])
    recent_searches = body.get("recent_searches", [])
    wishlist = body.get("wishlist", [])
    
    if not username or not email or not dob or not password:
        return jsonify({ "errMsg": "Missing values, All fields are compulsory!" }), 400
    if len(username) < 5:
        return jsonify({ "errMsg": "Username too short!" }), 400
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email.lower()):
        return jsonify({ "errMsg": "Invalid email format!" }), 400
    if len(password) < 6:
        return jsonify({ "errMsg": "Password must be atleast 6 characters!" }), 400
    
    username = username.strip()
    email = email.lower().strip()
    dob = dob.strip()
    
    try:
        dob_val = datetime.strptime(dob, "%Y-%m-%d")
        today = datetime.today()
        age = today.year - dob_val.year - ((today.month, today.day) < (dob_val.month, dob_val.day))
        if age <= 5 or age > 99:
            return jsonify({ "errMsg": "Inappropriate DOB for registration!" }), 400
    except Exception as e:
        print(e)
        return jsonify({ "errMsg": "Invalid date format (expected 'YYYY-MM-DD')" }), 400    
    existing_user = Users.find_one({ "$or": [{ "email": email }, { "u_name": username }] })
    if existing_user:
        return jsonify({ "errMsg": "User already exists!" }), 400
    
    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    user_data = {
        "username": username,
        "email": email,
        "password": hashed_pw,
        "dob": dob_val,
        "age": age,
        "wishlist": wishlist,
        "preferred_themes": preferred_themes,
        "recent_searches": recent_searches
    }
    db_res = Users.insert_one(user_data)
    if not db_res.acknowledged:
        return jsonify({ "errMsg": "Failed to insert data into Database!" }), 400
    
    print("User successfully registered into database.")
    print("Registered data for user- ", username)
    return jsonify({
        "success": True,
        "msg": "Registered successfully",
        "description": "Please login to continue..."
    })

# ==================================
# LOG IN USER (SIGNIN)
# ==================================
@auth_routes.route("/login", methods=['POST'])
def manual_signin():
    body = request.get_json()
    username = body.get("username")
    password = body.get("password")
    
    if not username or not password:
        return jsonify({ "errMsg": "Missing values, All fields are compulsory!" }), 400
    existing_data = Users.find_one({ "username": username })
    if not existing_data:
        return jsonify({ "errMsg": "No match found by this username!" }), 400
    data = ut.formatted_data([existing_data])
    hashed_pwd = data[0].get("password")
    is_pwd_same = bcrypt.check_password_hash(hashed_pwd, password)
    if not is_pwd_same:
        return jsonify({ "errMsg": "Password invalid/mismatch!" }), 400
    
    # generate token via user email
    token = create_access_token(identity=data[0].get("email"), expires_delta=timedelta(minutes=12))
    response = jsonify({
        "msg": "Login Successful",
        "description": "Welcome back to destinify...",
        "user_data": data[0],
        "token": token
    })
    response.set_cookie("access_token", token)
    
    return response, 200

# ==================================
# VERIFY TOKEN
# ==================================
@auth_routes.route("/verify")
@jwt_required(optional=True)
def verify_token():
    try:
        verify_jwt_in_request(optional=True)
        token_info = get_jwt_identity()
        if not token_info:
            return jsonify({ "success": False, "msg": "Token missing or invalid!" }), 401
        return jsonify({ "success": True, "user": token_info })
    except Exception as e:
        return jsonify({ "success": False, "msg": str(e) }), 401