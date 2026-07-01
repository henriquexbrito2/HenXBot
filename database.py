from pymongo import MongoClient
from config import MONGO_URI

client = MongoClient(MONGO_URI)

db = client["henxbot"]

users = db["users"]
guilds = db["guilds"]
tickets = db["tickets"]
logs = db["logs"]
youtube = db["youtube"]
economy = db["economy"]
levels = db["levels"]


def get_guild_config(guild_id: int):

    config = guilds.find_one(
        {"guild_id": str(guild_id)}
    )

    if not config:

        config = {
            "guild_id": str(guild_id),

            "prefix": "hxb!",

            "economy": {
                "daily_reward": 100,
                "work_min": 50,
                "work_max": 250
            },

            "xp": {
                "xp_min": 5,
                "xp_max": 15,
                "cooldown": 60
            },

            "logs": {
                "channel": None
            },

            "welcome": {
                "channel": None
            },

            "tickets": {
                "staff_role": None,
                "category": None,
                "message": "Abra um ticket para receber suporte."
            },

            "embed_color": 0xFF5B00
        }

        guilds.insert_one(config)

    return config
