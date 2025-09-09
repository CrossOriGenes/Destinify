from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

def get_places_collection():
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client.get_database()
    if db is None:
        raise Exception('Database not initialized!')
    return db["Places"]

# Export schema as 'Places'
Places = get_places_collection() 

# Schema for Places:
# {
#     "Place": str(),
#     "City": str(),
#     "Place_Desc": str(),
#     "Place_images": list(),
#     "Budget": list(),
#     "Duration": str(),
#     "City_Rating": float(),
#     "Ideal_Duration": Date(),
#     "Best_Time_To_Visit": list(),
#     "City_Desc": str(),
#     "Place": str(),
#     "Place_Rating": float(),
#     "Distance": int(),
#     "Place_Desc": str(),
#     "Duration": str(),
#     "Place_images": list(),
#     "Budget": list()
# }