from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta, UTC
from flask_jwt_extended import create_access_token, get_jwt_identity, verify_jwt_in_request, unset_jwt_cookies
from models.user_model import Users
from models.otps_model import OTPs
from controllers.mailings import send_mail
import controllers.utils as ut 
import re, random


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
    token = create_access_token(identity=data[0].get("email"), expires_delta=timedelta(hours=12))
    response = jsonify({
        "msg": f"Hi {username}",
        "description": "Welcome back to destinify...",
        "user_data": data[0],
        "token": token
    })
    response.set_cookie("access_token", token)
    
    return response, 200


# ==================================
# LOGOUT USER
# ==================================
@auth_routes.route("/logout")
def logout_user():
    try:
        verify_jwt_in_request()
        email = get_jwt_identity()
        response = jsonify({ 
            "success": True, 
            "msg": "User logged-out successfully..." 
        })
        unset_jwt_cookies(response)
        print(f"User with email-'{email}' logged out successfully")

        return response, 200
    except Exception as e:
        return jsonify({ "success": False, "msg": str(e) }), 401
        

# ==================================
# VERIFY TOKEN
# ==================================
@auth_routes.route("/verify")
def verify_token():
    try:
        verify_jwt_in_request()
        token_info = get_jwt_identity()
        return jsonify({ "verified": True, "data": token_info })
    except Exception as e:
        return jsonify({ "verified": False, "msg": str(e) }), 401
    

# =========================================
# FORGOT PASSWORD (generate OTP)
# =========================================
@auth_routes.route("/generate_otp", methods=['POST'])
def generate_otp_to_mail():
    body = request.get_json()
    email = body.get("email")
    if not email:
        return jsonify({ "errMsg": "Email Missing!" }), 400
    email = email.lower()
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({ "errMsg": "Invalid email format!" }), 400
    
    otp = str(random.randint(100000, 999999))
    hashed_otp = bcrypt.generate_password_hash(otp).decode("utf-8")
    now = datetime.now(UTC)
    expiery = now + timedelta(minutes=15)
    result = OTPs.update_one(
        {"email": email},
        {
            "$set": {
                "email": email,
                "otp": hashed_otp,
                "created_at": now,
                "expires_at": expiery
            }
        },
        upsert=True
    )
    if not result.did_upsert:
        return jsonify({ "success": False, "errMsg": "Failed to upsert into DB!" })
    print("Data upsurted successfully...")
    sent = send_mail(
        reciever=email,
        subject="OTP for password-reset verification request",
        otp=otp
    )
    if not sent:
        return jsonify({ 
            "success":False,
            "msg": "Email not sent!",
        }), 400
    
    return jsonify({
        "success": True,
        "msg": "OTP sent",
        "description": "OTP has been sent to email."
    })
    
    
# =========================================
# FORGOT PASSWORD (verify OTP)
# =========================================
@auth_routes.route("/verify_otp", methods=['POST'])
def verify_otp():
    body = request.get_json()
    email = body.get("email")
    otp = body.get("otp")
    if not otp:
        return jsonify({ "errMsg": "OTP missing!" }), 400

    cursor = OTPs.find_one({ "email": email })
    if not cursor:
        return jsonify({ 
            "success": False, 
            "msg": "Invalid OTP!",
            "description": "The OTP given either doesn't exists or is expired." 
        }), 422
    data = ut.formatted_data([cursor])
    hashed_otp = data[0].get("otp")
    isSame = bcrypt.check_password_hash(hashed_otp, otp)
    if not isSame:
        return jsonify({ 
            "success": False, 
            "msg": "OTP doesn't match!",
            "description": "OTP provided doesn't match, please try something else." 
        }), 400
    
    return jsonify({
        "success": True,
        "msg": "Verification successfull",
        "description": "OTP verified, continue resetting with a new password"
    })    
    
    
# =========================================
# TEST ROUTE
# =========================================
@auth_routes.route("/test")
def test():
    pass