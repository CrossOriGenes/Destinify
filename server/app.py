import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
PORT = int(os.getenv("PORT"))

@app.route("/")
def home():
    return jsonify({ "msg": "Server running successfully 🚀" })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=PORT, debug=True)