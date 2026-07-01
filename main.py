import discord
from discord.ext import commands
from config import TOKEN, PREFIX, BOT_NAME, BOT_VERSION

intents = discord.Intents.all()

bot = commands.Bot(
    command_prefix=PREFIX,
    intents=intents,
    help_command=None
)

@bot.event
async def on_ready():

    print("=" * 50)
    print(f"🤖 {BOT_NAME} iniciado!")
    print(f"📦 Versão: {BOT_VERSION}")
    print(f"👤 Logado como: {bot.user}")
    print(f"🏠 Servidores: {len(bot.guilds)}")
    print("=" * 50)

@bot.command()
async def ping(ctx):
    await ctx.send(
        f"🏓 Pong! `{round(bot.latency * 1000)}ms`"
    )

async def main():

    async with bot:

        await bot.load_extension("commands")

        await bot.start(TOKEN)

import asyncio
asyncio.run(main())
