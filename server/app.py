import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from flask_jwt_extended import JWTManager
# routes
from routes.places import places_routes
from routes.auth import auth_routes


load_dotenv() # initiate .env

app = Flask(__name__)

CORS(app)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")
app.config["JWT_TOKEN_LOCATION"] = ["cookies", "headers"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 60 * 60 * 12
JWTManager(app)
PORT = int(os.getenv("PORT"))
MONGO_URI = os.getenv("MONGO_URI", "")
DB_NAME = os.getenv("DB_NAME", "")


@app.route("/") # Root route
def home():
    return { "msg": "Server running successfully 🚀" }
# Utility routes
app.register_blueprint(places_routes, url_prefix="/api/places")
app.register_blueprint(auth_routes, url_prefix="/api/auth")


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

if __name__ == "__main__":
    print(f"Server running on PORT:{PORT}\n")
    app.run(host='0.0.0.0', port=PORT, debug=True)