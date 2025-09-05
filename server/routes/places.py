from flask import Blueprint, jsonify, request
import controllers.places_utils as plu

places_routes = Blueprint('places-routes', __name__)

# get all places by category
@places_routes.route("/category/<string:category>")
def get_places_by_category(category):
    categ = category.lower()
    page_count = int(request.args.get("count-request", 1))  # query param ?count-request=2
    limit = 20 if page_count == 1 else 8           

    if categ not in plu.keywords:
        return jsonify({ "errMsg": "Invalid category!" }), 400
      
    mask = plu.df["Place_Desc"].str.lower().str.contains(
        "|".join(plu.keywords[categ]), na=False
    )
    results = plu.df[mask].sort_values(by="Place_Rating", ascending=False, na_position="last").to_dict(orient="records")
    # calculate slicing as per 3 pages max → free plan
    start = (page_count - 1) * limit
    end = start + limit
    sliced = results[start:end]  
    if page_count > 3:
        return jsonify({ 
            "errMsg": "Your Free plan expired, please switch to our premium plans for more benefits." 
        }), 403

    print("\nTotal-matches found: ", len(results))
    return jsonify({
        "success": True,
        "count": len(sliced),
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
    try:
        # Unique cities
        unique_cities = list(set(plu.df["City"].dropna()))
        print("Unique cities count:", len(unique_cities))

        # Rest half to stay within API limit
        half = len(unique_cities) // 2
        selected_cities = unique_cities[half:]

        assigned = set()
        for idx, row in plu.df.iterrows():
            city = row["City"]
            if city in selected_cities and city not in assigned:
                img_url = plu.fetch_image(city)
                if img_url:
                    plu.df.at[idx, "Place_images"] = [img_url]
                    assigned.add(city)

        # Save updated dataset
        plu.df.to_csv('india_places_new.csv', index=False)

        return jsonify({
            "success": True,
            "msg": f"Updated {len(assigned)} cities with images",
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500  