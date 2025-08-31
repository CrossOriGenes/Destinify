import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
# routes
from routes.places import places_routes


load_dotenv() # initiate .env

app = Flask(__name__)

CORS(app)
PORT = int(os.getenv("PORT"))

@app.route("/") # Root route
def home():
    return { "msg": "Server running successfully 🚀" }
# Utility routes
app.register_blueprint(places_routes, url_prefix="/api/places")


# global errorhandler
@app.errorhandler(Exception)
def handle_exception(e):
    print(str(e))
    return jsonify({
        "success": False,
        "errMsg": f"Something went wrong!"
    }), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=PORT, debug=True)