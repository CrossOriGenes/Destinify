from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

def get_users_collection():
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client.get_database()
    if db is None:
        raise Exception('Database not found!')
    return db["Users"]

# Export schema as 'User'
Users = get_users_collection() 


def get_dummy_users_collection():
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client.get_database()
    if db is None:
        raise Exception('Database not found!')
    return db["Users_dummy"]

# Export schema as 'Users_dummy'
Users_dummy = get_dummy_users_collection()



# Schema for User:
# {
#     "username": str,
#     "age": int,
#     "dob": datetime,
#     "email": str,
#     "password": str, 
#     "preferences": {
#          "modes": list,
#          "interested_themes": list,
#      },
#     "recent_searches": [str],
#     "wishlist": list,
#     "picture": str
# }