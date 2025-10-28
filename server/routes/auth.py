from flask import Blueprint, request, jsonify, Response, redirect
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta, UTC
from flask_jwt_extended import create_access_token, get_jwt_identity, verify_jwt_in_request, unset_jwt_cookies
from models.user_model import Users
from models.otps_model import OTPs
from controllers.mailings import send_mail
import controllers.utils as ut 
import re, random, os, requests, json


auth_routes = Blueprint('auth-routes', __name__)
bcrypt = Bcrypt()
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = "http://127.0.0.1:5000/api/auth/google/callback"
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")




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
    existing_user = Users.find_one({ 
        "$or": [
            { "email": { "$regex": email, "$options": "i" } }, 
            { "u_name": { "$regex": username, "$options": "i" } }
        ] 
    })
    if existing_user:
        return jsonify({ "errMsg": "User already exists!" }), 400
    try:
        dob_val = datetime.strptime(dob, "%Y-%m-%d")
        today = datetime.today()
        age = today.year - dob_val.year - ((today.month, today.day) < (dob_val.month, dob_val.day))
        if age <= 5 or age > 99:
            return jsonify({ "errMsg": "Inappropriate DOB for registration!" }), 400
    except Exception as e:
        print(e)
        return jsonify({ "errMsg": "Invalid date format (expected 'YYYY-MM-DD')" }), 400    
    
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
    preferred_themes = body.get("preferred_themes", [])
    recent_searches = body.get("recent_searches", [])
    wishlist = body.get("wishlist", [])
    
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
    # compare existing vs request array lengths and update db only if request is more
    searches = data[0].get("recent_searches")
    themes = data[0].get("preferred_themes")
    wlist = data[0].get("wishlist")
    if len(recent_searches) > len(searches):
        res = Users.update_one({ "username": username }, { "$set": { "recent_searches": recent_searches } })
        if res.acknowledged: print(f"Recent searches updated of user with email-'{username}'")
    if len(preferred_themes) > len(themes):
        res = Users.update_one({ "username": username }, { "$set": { "preferred_themes": preferred_themes } })
        if res.acknowledged: print(f"Preferred themes updated of user with username-'{username}'")
    if len(wishlist) > len(wlist):
        res = Users.update_one({ "username": username }, { "$set": { "wishlist": wishlist } })
        if res.acknowledged: print(f"Wishlist updated of user with username-'{username}'")
    
    cursor = Users.find_one({ "username": username })
    data = ut.formatted_data([cursor])
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
# GOOGLE SIGN-IN
# ==================================
@auth_routes.route("/google")
def google_login():
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        "?response_type=code"
        f"&client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URI}"
        "&scope=openid%20email%20profile"
        "&access_type=offline"
    )
    return redirect(google_auth_url)

@auth_routes.route("/google/callback")
def google_callback():
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Missing code"}), 400
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    token_res = requests.post(token_url, data=data)
    tokens = token_res.json()
    userinfo_res = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {tokens['access_token']}"}
    )
    userinfo = userinfo_res.json()
    email = userinfo.get("email")
    picture = userinfo.get("picture")
    existing_user = Users.find_one(
        { "email": email }, 
        { "email": 1, "username": 1, "_id": 0 }
    )
    
    if existing_user:    
        userData = json.dumps({
            "email": email,
            "picture": picture,
            "isNew": False
        })
    else:
        username = userinfo.get("name")
        userData = json.dumps({
            "username": username,
            "email": email,
            "picture": picture,
            "isNew": True
        })
    html = f"""
        <script>
            if (window.opener && window.opener !== window) {{
                window.opener.postMessage({ userData }, "*");
                window.close();
            }} else {{
                console.log("No opener found, printing data instead...");
                console.log({ userData });
                document.write("<h3>Login successful. You can close this tab.</h3>");
            }}
        </script>
    """
                
    return Response(html, mimetype="text/html")


# ==================================
# GITHUB SIGN-IN
# ==================================
@auth_routes.route("/github")
def github_login():
    redirect_uri = "http://localhost:5000/api/auth/github/callback"
    github_url = (
        "https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}&redirect_uri={redirect_uri}&scope=user:email"
    )
    return redirect(github_url)

@auth_routes.route("/github/callback")
def github_callback():
    code = request.args.get("code")
    token_res = requests.post(
        "https://github.com/login/oauth/access_token",
        headers={"Accept": "application/json"},
        data={
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code,
        },
    )
    token_res.raise_for_status()
    token_data = token_res.json()
    access_token = token_data.get("access_token")

    user_res = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    user_res.raise_for_status()
    user = user_res.json()
    email = user.get("email")
    if not email:
        email_res = requests.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        email_res.raise_for_status()
        emails = email_res.json()
        primary_email = next((e["email"] for e in emails if e.get("primary")), None)
        email = primary_email
    name = user.get("name") or user.get("login")
    avatar = user.get("avatar_url")
    existing_user = Users.find_one(
        { "email": email }, 
        { "email": 1, "username": 1, "_id": 0 }
    )
        
    if existing_user:
        userData = json.dumps({
            "email": email,
            "picture": avatar,
            "isNew": False
        })
    else:
        userData = json.dumps({
            "username": name,
            "email": email,
            "picture": avatar,
            "isNew": True
        })
    html = f"""
        <script>
            if (window.opener && window.opener !== window) {{
                window.opener.postMessage({ userData }, "*");
                window.close();
            }} else {{
                console.log("No opener found, printing data instead...");
                console.log({ userData });
                document.write("<h3>Login successful. You can close this tab.</h3>");
            }}
        </script>
    """
        
    return Response(html, mimetype='text/html')


# ========================================
# SOCIAL AUTH APIs FOR OLD & NEW USER
# ========================================
@auth_routes.route("/old_user_auth", methods=['POST'])
def old_user_auth_google():
    body = request.get_json()
    email = body.get("email")
    picture = body.get("picture")
    preferred_themes = body.get("preferred_themes", [])
    recent_searches = body.get("recent_searches", [])
    wishlist = body.get("wishlist", [])
    
    if not email:
        return jsonify({ 
            "errMsg": "Email unavailable!", 
            "description": "The email is unavailable for authentication"
        }), 400
    cursor = Users.find_one({ "email": email }) 
    if not cursor:
        return jsonify({ 
            "errMsg": "user not found!", 
            "description": "User is not found in DB"
        }), 400
    data = ut.formatted_data([cursor])
    # compare existing vs request array lengths and update db only if request is more
    if len(recent_searches) > len(data[0].get("recent_searches")):
        res = Users.update_one({ "email": email }, { "$set": { "recent_searches": recent_searches } })
        if res.acknowledged: print(f"Recent searches updated of user with email-'{email}'")
    if len(preferred_themes) > len(data[0].get("preferred_themes")):
        res = Users.update_one({ "email": email }, { "$set": { "preferred_themes": preferred_themes } })
        if res.acknowledged: print(f"Preferred themes updated of user with email-'{email}'")
    if len(wishlist) > len(data[0].get("wishlist")):
        res = Users.update_one({ "email": email }, { "$set": { "wishlist": wishlist } })
        if res.acknowledged: print(f"Wishlist updated of user with email-'{email}'")
    if len(data[0].get("picture")) == 0:
        res = Users.update_one({ "email": email }, { "$set": { "picture": picture } })
        if res.acknowledged: print(f"Picture updated of user with email-'{email}'")
    
    token = create_access_token(identity=email, expires_delta=timedelta(hours=12))
    response = jsonify({
        "msg": f"Hi {data[0].get("username")}",
        "description": "Welcome back to destinify...",
        "user_data": data[0],
        "token": token
    })
    response.set_cookie("access_token", token)
    
    return response, 200

@auth_routes.route("/new_user_auth", methods=['POST'])
def new_user_auth_google():
    body = request.get_json()
    email = body.get("email")
    picture = body.get("picture")
    username = body.get("username")
    dob = body.get("dob")
    preferred_themes = body.get("preferred_themes", [])
    recent_searches = body.get("recent_searches", [])
    wishlist = body.get("wishlist", [])
    
    existing_name = Users.find_one({ "username": { "$regex": f"^{username}$", "$options": "i" } })
    if existing_name:
        return jsonify({ 
            "errMsg": f"A record already exists with the same username-'{username}'! Try some other combinations" 
        }), 400
    try:
        dob_val = datetime.strptime(dob, "%Y-%m-%d")
        today = datetime.today()
        age = today.year - dob_val.year - ((today.month, today.day) < (dob_val.month, dob_val.day))
        if age <= 5 or age > 99:
            return jsonify({ "errMsg": "Inappropriate DOB for registration!" }), 400
    except Exception as e:
        print(e)
        return jsonify({ "errMsg": "Invalid date format (expected 'YYYY-MM-DD')" }), 400    
    user = {
        "username": username,
        "email": email,
        "picture": picture,
        "dob": dob_val,
        "age": age,
        "wishlist": wishlist,
        "preferred_themes": preferred_themes,
        "recent_searches": recent_searches
    }
    db_res = Users.insert_one(user)
    if not db_res.acknowledged:
        return jsonify({ "errMsg": "Failed to insert data into Database!" }), 400
    
    print("User successfully registered into database.")
    token = create_access_token(identity=email, expires_delta=timedelta(hours=12))
    cursor = Users.find_one({ "username": username })
    data = ut.formatted_data([cursor])
    response = jsonify({
        "msg": f"Hi {user.get("username")}",
        "description": "Welcome to destinify...",
        "token": token,
        "user_data": data[0],
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
        { "email": email },
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
        return jsonify({ "errMsg": "Failed to upsert into DB!" }), 400
    print("Data upsurted successfully...")
    sent = send_mail(
        reciever=email,
        subject="OTP for password-reset verification request",
        otp=otp
    )
    if not sent:
        return jsonify({ "errMsg": "Email not sent!" }), 400
    
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
        return jsonify({ 
            "success": False,
            "msg": "OTP missing!",
            "description": "Please fill in the OTP to continue." 
        }), 400

    cursor = OTPs.find_one({ "email": email })
    if not cursor:
        return jsonify({ 
            "success": False, 
            "msg": "Invalid OTP!",
            "description": "The OTP given either doesn't exists or is expired." 
        }), 400
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
# RESET PASSWORD 
# =========================================
@auth_routes.route("/resetpw", methods=['POST'])
def reset_password():
    body = request.get_json()
    email = body.get("email")
    new_pass = body.get("password")
    if not email or not new_pass:
        return jsonify({ 
            "success": False,
            "msg": "Parameters missing!",
            "description": "Email / password missing." 
        }), 400

    cursor = Users.find_one({ "email": email })
    if not cursor:
        return jsonify({ 
            "success": False, 
            "msg": "Invalid email address!",
            "description": "The email given either doesn't exists or has been removed." 
        }), 400
    hashed_pw = bcrypt.generate_password_hash(new_pass).decode("utf-8")
    result = Users.update_one({ "email": email }, { "$set": { "password": hashed_pw } })
    if result.modified_count == 0:
        return jsonify({ 
            "success": False, 
            "msg": "Updation failed!",
            "description": "Failed to reset password, please try again later." 
        }), 400
    
    return jsonify({
        "success": True,
        "msg": "Password Changed",
        "description": "Your new password has been updated. Re-login to continue"
    })    

    
# =========================================
# TEST ROUTE
# =========================================
@auth_routes.route("/test")
def test():
    pass