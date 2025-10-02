from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

def get_users_collection():
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client.get_database()
    if db is None:
        raise Exception('Database not initialized!')
    return db["Users"]

# Export schema as 'User'
User = get_users_collection() 

# Schema for User:
# {
#     "u_name": str(),
#     "dob": date(),
#     "age": int(),
#     "email": str(),
#     "preferences": list(),
# }