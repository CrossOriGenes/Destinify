from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from flask_bcrypt import Bcrypt
from schemas.user_schema import Users
from schemas.place_schema import Places
from schemas.otps_schema import OTPs
from neurals.travel_recommender_predict import predict_category
import cloudinary.uploader as uploader
from datetime import datetime
from bson import ObjectId
import controllers.utils as ut 
import random, re


users_routes = Blueprint('users-routes', __name__)

bcrypt = Bcrypt()



# ==================================
# CHECK FOR EXISTING EMAIL
# ==================================
@users_routes.route("/check/r1/<string:username>")
def check_existing_user_by_name(username: str):
    cursor = list(Users.find(
        { "username": {"$regex": username, "$options": "i"} }, 
        { "username": 1 }
    ))
    users = ut.formatted_data(cursor)
    if not users or len(users) == 0:
        return jsonify({ "exists": False })
    return jsonify({ "exists": True })

# ==================================
# CHECK FOR EXISTING EMAIL
# ==================================
@users_routes.route("/check/r2/<string:email>")
def check_existing_user_by_email(email: str):
    cursor = Users.find_one(
        { "email": {"$regex": email, "$options": "i"} }, 
        { "username": 1, "email": 1 }
    )                           
    if not cursor:
        return jsonify({ "exists": False })
    return jsonify({ "exists": True })


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
# UPDATE USER'S DATA
# ==================================
@users_routes.route("/update_user", methods=['PATCH'])
def update_user():
    verify_jwt_in_request()
    current_user_email = get_jwt_identity()
    user = Users.find_one({ "email": current_user_email })
    if not user:
        return jsonify({ 
            "errMsg": "User not found!",
            "description": "No data is assosciated with this email ID / username." 
        }), 400
    data = request.form.to_dict()
    file = request.files.get("image")
    update_fields = {}
    for key, value in data.items():
        if key == "dob":
            val = ut.normalize_date(user["dob"])
            if str(data["dob"]) == str(val): continue
        if key in user and str(user[key]) == value:
            continue
        update_fields[key] = value
    if file:
        allowed_types = ["image/jpeg", "image/png", "image/jpg"]
        if file.content_type not in allowed_types:
            return jsonify({
                "errMsg": "Invalid file type!",
                "description": "Provided profile picture doesn't match expected file extension format"
            }), 400
        old_pic_id = user.get("pic_id")
        if old_pic_id:
            try:
                uploader.destroy(old_pic_id)
                print("Existing image deleted from cloudinary ✅")
            except Exception as e:
                print("Failed to delete existing image from cloudinary ❌")
        # upload new image
        image_upload_result = uploader.upload(
            file,
            folder="destinify",
            public_id=str(ObjectId()),
            overwrite=True,
            resource_type="image"
        )
        update_fields["picture"] = image_upload_result["secure_url"]
        update_fields["pic_id"] = image_upload_result["public_id"]
        if "dob" in data and data["dob"]:
            update_fields["dob"] = datetime.strptime(data["dob"], "%Y-%m-%d")
        if "age" in data and data["age"]:
            update_fields["age"] = int(data["age"])
    if not update_fields:
        return jsonify({ "message": "No changes detected" }), 201
    result = Users.update_one({ "email": current_user_email }, { "$set": update_fields })
    if result.acknowledged:
        print("User data updated successfully. ✅")        
    
    return jsonify({ 
        "success": True,
        "msg": "Modification successful",
        "description": "Your Profile has been updated and modified as set by you." 
        # "patched_data": update_fields, 
    })
        

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


# ==================================
# GET USER'S DURATION PREDICTION (by preference & age)
# ==================================
@users_routes.route("/suggest_place_from_model", methods=['POST'])
def suggest_place_from_model():
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
    predicted_themes = result["predicted_themes"]
    cursor = list(Places.find(
        { "Category": { "$elemMatch": { "$in": predicted_themes } } },
        { "City": 1, "Place": 1, "Place_Rating": 1, "Place_Desc": 1, "Place_images": 1 }
    ))
    places = ut.formatted_data(cursor)
    random.shuffle(places)
    places = places[:10]
     
    return jsonify({
        "success": True,
        "msg": "places recommended based on users age and preferences and travellers choice.",
        "result": result,
        "places": places
    })


# ==================================
# GET USER'S DURATION PREDICTION (by preference & age)
# ==================================
@users_routes.route("/revisit_searched_places", methods=['POST'])
def revisit_places():
    data = request.get_json()
    search_history = data.get("search_history", [])
    if not search_history or not isinstance(search_history, list):
        return jsonify({ "errMsg": "Search history doesn't exists!" }), 400
    
    visited_places = []
    similar_places = []
    # Fetch places based on search history
    for place_name in search_history:
        cursor = Places.find_one(
            { "Place": { "$regex": f"^{re.escape(place_name)}$", "$options": "i" }},
            { "City": 1, "Place": 1, "Place_Rating": 1, "Place_Desc": 1, "Place_images": 1 }
        )
        if cursor:
            temp = ut.formatted_data([cursor])
            place = temp[0]
            visited_places.append(place)
        
    total_visited = len(visited_places)
    remaining = max(1, 15 - total_visited)
    # Fetch places based on category/city
    random_places_cursor = Places.aggregate([
        { "$sample": { "size": remaining } },
        { "$project": { "City": 1, "Place": 1, "Place_Rating": 1, "Place_Desc": 1, "Place_images": 1 }}
    ])
    random_places = ut.formatted_data(list(random_places_cursor))
    similar_places.extend(random_places)
    
    all_places = visited_places + similar_places
    combined = []
    seen = set()
    for p in all_places:
        name = p.get("Place", "").strip().lower()
        if name not in seen:
            seen.add(name)
            combined.append(p)
    random.shuffle(combined)
    final_places = combined[:15]
    
    return jsonify({ 
        "success": True, 
        "msg": "places recommended based on users search-history and similarities.",
        "places": final_places
    })


# ==================================
# DELETE USER 
# ==================================
@users_routes.route("/delete_user", methods=['DELETE'])
def delete_user():
    verify_jwt_in_request()
    email = get_jwt_identity()
    otp = request.args.get("otp", "")
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
    hashed_otp = cursor["otp"]
    isSame = bcrypt.check_password_hash(hashed_otp, otp)
    if not isSame:
        return jsonify({ 
            "success": False, 
            "msg": "OTP doesn't match!",
            "description": "OTP provided doesn't match, please try something else." 
        }), 400
    user = Users.find_one({ "email": email })
    if not user:
        return jsonify({ 
            "errMsg": "User not found!",
            "description": "No data is assosciated with this email ID / username." 
        }), 400
    old_pic_id = user.get("pic_id")
    if old_pic_id:
        try:
            uploader.destroy(old_pic_id)
            print("Existing image deleted from cloudinary ✅")
        except Exception as e:
            print("Failed to delete existing image from cloudinary ❌")
    result = Users.delete_one({ "email": email })
    if result.acknowledged:
        print("User successfully removed from DB ✅")
    
    return jsonify({
        "success": True,
        "msg": "Account removed",
        "description": "Your account was successfully removed. Please register to continue again"
    })    
    
    
# ==================================
# TEST ROUTE
# ==================================
@users_routes.route("/test")
def test():
    cursor = Users.find_one({ "email": "dsnehodipto@gmail.com" })
    if not cursor:
        return jsonify({ "errMsg": "Data not found" }), 400  
    data = ut.formatted_data([cursor])
    
    return jsonify({ 
        "success": True,
        "user": ut.serialize_user(data[0])
    })