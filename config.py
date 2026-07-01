import os
from dotenv import load_dotenv

load_dotenv()

# =========================
# BOT
# =========================

TOKEN = os.getenv("TOKEN")
PREFIX = os.getenv("PREFIX", "hxb!")

BOT_NAME = "HenXBot"
BOT_VERSION = "1.0.0"

# =========================
# DATABASE
# =========================

MONGO_URI = os.getenv("MONGO_URI")

# =========================
# EMBEDS
# =========================

DEFAULT_COLOR = 0xFF5B00

SUCCESS_COLOR = 0x57F287
ERROR_COLOR = 0xED4245
WARNING_COLOR = 0xFEE75C

# =========================
# ECONOMIA PADRÃO
# =========================

DEFAULT_DAILY_REWARD = 100

DEFAULT_WORK_MIN = 50
DEFAULT_WORK_MAX = 250

# =========================
# XP PADRÃO
# =========================

DEFAULT_XP_MIN = 5
DEFAULT_XP_MAX = 15

DEFAULT_XP_COOLDOWN = 60

# =========================
# TICKETS
# =========================

DEFAULT_TICKET_MESSAGE = (
    "Olá! Descreva seu problema e aguarde um membro da equipe."
)

# =========================
# LOGS
# =========================

LOG_DELETE = True
LOG_EDIT = True
LOG_JOIN = True
LOG_LEAVE = True
