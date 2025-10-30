from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

def get_otps_collection():
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client.get_database()
    if db is None:
        raise Exception('Database not found!')
    return db["OTPs"]

# Export schema as 'OTPs'
OTPs = get_otps_collection()
# TTL-based indexing for auto-deletion at expiery
OTPs.create_index("id", expireAfterSeconds=900) 


# Schema for OTPs:
# {
#     "email": str,
#     "otp": str,
#     "created_at": utc,
#     "expires_at": utc
# }