import asyncio
import discord
from discord.ext import commands

from config import (
    TOKEN,
    PREFIX,
    BOT_NAME,
    BOT_VERSION
)

intents = discord.Intents.all()

bot = commands.Bot(
    command_prefix=PREFIX,
    intents=intents,
    help_command=None
)

# =========================
# EVENTOS
# =========================

@bot.event
async def on_ready():

    print("=" * 50)
    print(f"🤖 {BOT_NAME} iniciado!")
    print(f"📦 Versão: {BOT_VERSION}")
    print(f"👤 Logado como: {bot.user}")
    print(f"🏠 Servidores: {len(bot.guilds)}")
    print("=" * 50)

# =========================
# CARREGAR COMANDOS
# =========================

async def load_extensions():

    try:
        await bot.load_extension("commands")
        print("✅ commands.py carregado!")
    except Exception as e:
        print(f"❌ Erro ao carregar commands.py: {e}")

# =========================
# INICIAR BOT
# =========================

async def main():

    async with bot:

        await load_extensions()

        try:
            synced = await bot.tree.sync()
            print(f"✅ {len(synced)} Slash Commands sincronizados!")
        except Exception as e:
            print(f"❌ Erro ao sincronizar Slash Commands: {e}")

        await bot.start(TOKEN)

if __name__ == "__main__":
    asyncio.run(main())
