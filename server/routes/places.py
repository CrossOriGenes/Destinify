from flask import Blueprint, jsonify, request
import controllers.utils as ut
from models.place_model import Places
from bson import ObjectId
from datetime import datetime
import re


places_routes = Blueprint('places-routes', __name__)
            
            
# ===================================
# GET PLACE DATA BY ID
# ===================================
@places_routes.route("/")
def get_place_data_by_id():
    place_id = request.args.get("id", "")
    if not place_id:
        return jsonify({ "errMsg": "Place-ID missing!" }), 404
    cursor = Places.find_one({ "_id": ObjectId(place_id) })
    if not cursor:
        return jsonify({ "errMsg": "No data found!" }), 404    
    data = ut.formatted_data([cursor])
    place = data[0].get("Place")
    place_review = ut.fetch_google_reviews(place)
    existing_photos = data[0].get("Place_images")
    new_photos = place_review.get("photos", [])
    if not new_photos or len(new_photos) < 1:
        print(f"No google photos found for {place}!\nUsing Unsplash fallback to generate new photos...")
        new_photos = ut.fetch_place_unsplash_photos(place, 10)
    photos = new_photos + existing_photos
    Places.update_one(
        {"_id": place_id},
        {"$set": { "Place_images": photos }}
    )
    reviews = place_review.get("reviews")
    aspect_ratings = place_review.get("aspect_ratings")
    overall_rating = place_review.get("overall_rating")
    
    
    return jsonify({ 
        "success": True, 
        "data": {
            "place_data": data[0], 
            "reviews": reviews,
            "overall_rating": overall_rating,
            "aspect_ratings": aspect_ratings
        }
    }), 200


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


# ================================
# GET A PLACE BY SEARCHED NAME
# ================================
@places_routes.route("/search")
def get_a_place_by_name():
    place_name = request.args.get("p", "")
    if not place_name:
        return jsonify({ "errMsg": "Missing Place name!" }), 404
    
    cursor = Places.find_one({ "Place": place_name }, { "_id": 1 })
    if not cursor:
        return jsonify({ "errMsg": f"No match found with '{place_name}'!" }), 404
    return jsonify({ "id": str(cursor["_id"]) }), 200

            
# ====================================
# GET PLACES QUICK ACCESS SUMMARIES
# ====================================
# ------------ set 1 ---------------
@places_routes.route("/summaries/s1")
def get_summary_set_1():
    # 1
    cursor_1 = Places.find({"City_Desc": {"$regex": "odisha", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_1))
    place_1 = {
        "place_name": "Odisha",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    }  
    # 2
    cursor_2 = Places.find({"City_Desc": {"$regex": "goa", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_2))
    place_2 = {
        "place_name": "Goa",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    } 
    # 3
    cursor_3 = Places.find({"City_Desc": {"$regex": "punjab", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_3))
    place_3 = {
        "place_name": "Punjab",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    } 
    # 4
    cursor_4 = Places.find({"City_Desc": {"$regex": "udaipur", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_4))
    place_4 = {
        "place_name": "Udaipur",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    } 
    # 5
    cursor_5 = Places.find({"City_Desc": {"$regex": "sikkim", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_5))
    place_5 = {
        "place_name": "Sikkim",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    } 
    # 6
    cursor_6 = Places.find({"City_Desc": {"$regex": "kerala", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_6))
    place_6 = {
        "place_name": "Kerala",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    } 
    
    return jsonify({
        "success": True,    
        "data": [ place_1, place_2, place_3, place_4, place_5, place_6 ]
    }), 200

# ------------ set 2 ---------------
@places_routes.route("/summaries/s2")
def get_summary_set_2():
    # 1
    cursor_1 = Places.find({"City_Desc": {"$regex": "manali", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_1))
    place_1 = {
        "place_name": "Manali",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    } 
    # 2
    cursor_2 = Places.find({"City_Desc": {"$regex": "leh", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_2))
    place_2 = {
        "place_name": "Leh Ladakh",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    }  
    # 3
    cursor_3 = Places.find({"City_Desc": {"$regex": "darjeeling", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_3))
    place_3 = {
        "place_name": "Darjeeling",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    } 
    
    return jsonify({
        "success": True,    
        "data": [ place_1, place_2, place_3]
    }), 200

# ------------ set 3 ---------------
@places_routes.route("/summaries/s3")
def get_summary_set_3():
    # 1
    cursor_1 = Places.find({"City_Desc": {"$regex": "varanasi", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_1))
    place_1 = {
        "place_name": "Varanasi",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    }  
    # 2
    cursor_2 = Places.find({"City_Desc": {"$regex": "jaipur", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_2))
    place_2 = {
        "place_name": "Jaipur",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    } 
    # 3
    cursor_3 = Places.find({"City_Desc": {"$regex": "bhubaneshwar", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_3))
    place_3 = {
        "place_name": "Bhubaneshwar",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    } 
    # 4
    cursor_4 = Places.find({"City_Desc": {"$regex": "ooty", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_4))
    place_4 = {
        "place_name": "Ooty",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    } 
    # 5
    cursor_5 = Places.find({"City_Desc": {"$regex": "rishikesh", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_5))
    place_5 = {
        "place_name": "Rishikesh",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    } 
    # 6
    cursor_6 = Places.find({"City_Desc": {"$regex": "lakshadweep", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_6))
    place_6 = {
        "place_name": "Lakshadweep",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    } 
    
    return jsonify({
        "success": True,    
        "data": [ place_1, place_2, place_3, place_4, place_5, place_6 ]
    }), 200

# ------------ set 4 ---------------
@places_routes.route("/summaries/s4")
def get_summary_set_4():
    # 1
    cursor_1 = Places.find({"City_Desc": {"$regex": "shimla", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_1))
    place_1 = {
        "place_name": "Shimla",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    } 
    # 2
    cursor_2 = Places.find({"City_Desc": {"$regex": "munnar", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_2))
    place_2 = {
        "place_name": "Munnar",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    }  
    # 3
    cursor_3 = Places.find({"City_Desc": {"$regex": "coorg", "$options": "i"}}).sort("City_Rating", -1)
    temp = ut.formatted_data(list(cursor_3))
    place_3 = {
        "place_name": "Coorg",
        "pic": temp[0].get("Place_images")[0],
        "subtitle": f"({len(temp)}+ Best visiting Place)",
        "description": temp[0].get("City_Desc").split(".")[0],
        "rating_val": temp[0].get("City_Rating"),
    } 
    
    return jsonify({
        "success": True,    
        "data": [ place_1, place_2, place_3]
    }), 200

                    
# ===================================
# GET SUGGESTIVE PLACE NAMES (SEARCHBAR)
# ===================================
@places_routes.route("/suggest")
def suggest_places():
    query = request.args.get("q", "").strip()
    if not query:
        return jsonify({ "suggestions": [] })
    
    regex = re.compile(query, re.IGNORECASE)
    cursor = Places.find(
        {"$or": [{"Place": regex}, {"City": regex}]},
        {"Place": 1, "City": 1, "_id": 0}
    ).limit(5)
    suggestions = list(cursor)
    return jsonify({ "suggestions": suggestions }), 200

            
# ===================================
# GET RECOMMENDATIONS ACCORDING TO USERS DATA
# ===================================
@places_routes.route("/recommend", methods=['POST'])
def get_place_recommendations():
    data = request.get_json()
    journey_date = data.get("journey_date")
    return_date = data.get("return_date")
    destination = data.get("destination", "").strip()
    budget = data.get("budget")   
    days = data.get("days")       
    if not journey_date or not return_date or not destination or not days:
        return jsonify({"errMsg": "Missing required fields!"}), 400
    if journey_date > return_date:
        return jsonify({"errMsg": "Return date can't be before journey date!"}), 400    
    if journey_date == return_date:
        return jsonify({"errMsg": "Dates can't be same!"}), 400
        
    if days <= 4:
        duration = "short"
    elif days <= 7:
        duration = "medium"
    else:
        duration = "long"
    query = {
        "$or": [
            {"Place": {"$regex": f"^{destination}$", "$options": "i"}},
            {"City": {"$regex": f"^{destination}$", "$options": "i"}},
            {"Place_Desc": {"$regex": f"^{destination}$", "$options": "i"}},
            {"City_Desc": {"$regex": f"^{destination}$", "$options": "i"}}
        ]
    }
    if budget and isinstance(budget, list) and len(budget) == 2:
        query["budget.0"] = {"$lte": budget[1]}  
        query["budget.1"] = {"$gte": budget[0]}  
    cursor = Places.find(query)
    results = list(cursor)
    jd = datetime.fromisoformat(journey_date)
    current_month = jd.month
    seasonal_matches = []
    others = []
    for r in results:
        months = r.get("Best_Time_To_Visit", []) or r.get("Ideal_Months", [])
        if current_month in months:
            seasonal_matches.append(r)
        else:
            others.append(r)
    final_results = seasonal_matches + others
    city_names = list({p.get("City") for p in final_results if p.get("City")})
    festival_ids = ut.get_current_festival_place_ids(city_names, final_results)
    if festival_ids:
        final_results = ut.apply_festival_boost(final_results, festival_ids)
    final_results = ut.formatted_data(final_results[:20])

    return jsonify({
        "count": len(final_results),
        "duration": duration,
        "places": final_results,
        "msg": "Here are your best suggestions..."
    }), 200



# ===========================
# Test API
# ===========================
@places_routes.route("/test")
def test_route():
    place_id = request.args.get("id", "")
    if not place_id:
        return jsonify({ "errMsg": "Place-ID missing!" }), 404
    cursor = Places.find_one({ "_id": ObjectId(place_id) })
    if not cursor:
        return jsonify({ "errMsg": "No data found!" }), 404    
    data = ut.formatted_data([cursor])
    place = data[0].get("Place")
    img_urls = ut.fetch_place_unsplash_photos(place, 10)
    if not img_urls:
        return jsonify({ "errMsg": "No image Found!" }), 404
    existing_photos = data[0].get("Place_images")
    # result = Places.update_one(
    #     { "Place": place },
    #     {"$set": {"Place_images": [img_url]}}
    # )
    
    # print(f"Updated {result.modified_count} docs for Dalhousie")
    return jsonify({
        "place": place,
        # "count": result.modified_count
        "new_images": img_urls,
        "old_images": existing_photos
    }), 200