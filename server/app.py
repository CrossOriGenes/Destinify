import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from flask_jwt_extended import JWTManager
from controllers.mailings import init_mail
# routes
from routes.places import places_routes
from routes.auth import auth_routes
from routes.users import users_routes


load_dotenv() # initiate .env

app = Flask(__name__)

CORS(app)
init_mail(app)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")
app.config["JWT_TOKEN_LOCATION"] = ["cookies", "headers"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 60 * 60 * 12
jwt = JWTManager(app)
PORT = int(os.getenv("PORT"))
MONGO_URI = os.getenv("MONGO_URI", "")
DB_NAME = os.getenv("DB_NAME", "")


@app.route("/") # Root route
def home():
    return { "msg": "Server running successfully 🚀" }
# Utility routes
app.register_blueprint(places_routes, url_prefix="/api/places")
app.register_blueprint(auth_routes, url_prefix="/api/auth")
app.register_blueprint(users_routes, url_prefix="/api/users")


# Connection to DB
try:
    client = MongoClient(MONGO_URI)
    db = client.get_database()
    print("\nConnected to DB.")
except Exception as e:
    print("\nFailed to connect DB!", str(e))
    sys.exit(1)


# global errorhandler
@app.errorhandler(Exception)
def handle_exception(e):
    print(str(e))
    return jsonify({
        "success": False,
        "errMsg": f"Something went wrong!"
    }), 500


# jwt callbacks
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({ "success": False, "msg": "Your token has expired" }), 401

@jwt.invalid_token_loader
def invalid_token_callback(error_string):
    return jsonify({ "success": False, "msg": "Your token is invalid" }), 422
    
@jwt.unauthorized_loader
def missing_token_callback(error_string):
    return jsonify({ "success": False, "msg": "Missing Authorization header" }), 401
    
@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return jsonify({ "success": False, "msg": "Token has been revoked" }), 401


if __name__ == "__main__":
    print(f"Server running on PORT:{PORT}\n")
    app.run(host='0.0.0.0', port=PORT, debug=True)