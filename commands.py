import discord
from discord.ext import commands
from database import users, guilds, get_guild_config
from systems import generate_work_reward
import datetime

class Economy(commands.Cog):

    def __init__(self, bot):
        self.bot = bot

    # =========================
    # BALANCE
    # =========================

    @commands.command()
    async def balance(self, ctx):

        user = users.find_one({
            "guild_id": str(ctx.guild.id),
            "user_id": str(ctx.author.id)
        })

        if not user:

            user = {
                "guild_id": str(ctx.guild.id),
                "user_id": str(ctx.author.id),
                "money": 0,
                "xp": 0,
                "level": 1
            }

            users.insert_one(user)

        embed = discord.Embed(
            title="💰 Carteira",
            description=f"Você possui **${user['money']}**",
            color=0xFF5B00
        )

        await ctx.send(embed=embed)

    # =========================
    # DAILY
    # =========================

    @commands.command()
    async def daily(self, ctx):

        config = get_guild_config(ctx.guild.id)

        reward = config["economy"]["daily_reward"]

        user = users.find_one({
            "guild_id": str(ctx.guild.id),
            "user_id": str(ctx.author.id)
        })

        if not user:

            user = {
                "guild_id": str(ctx.guild.id),
                "user_id": str(ctx.author.id),
                "money": 0,
                "last_daily": None
            }

            users.insert_one(user)

        now = datetime.datetime.utcnow()

        if user.get("last_daily"):

            diff = now - user["last_daily"]

            if diff.total_seconds() < 86400:
                return await ctx.send(
                    "⏳ Você já coletou seu daily hoje."
                )

        users.update_one(
            {
                "guild_id": str(ctx.guild.id),
                "user_id": str(ctx.author.id)
            },
            {
                "$set": {
                    "last_daily": now
                },
                "$inc": {
                    "money": reward
                }
            }
        )

        await ctx.send(
            f"🎁 Você recebeu **${reward}**!"
        )

    # =========================
    # WORK
    # =========================

    @commands.command()
    async def work(self, ctx):

        config = get_guild_config(ctx.guild.id)

        reward = generate_work_reward(
            config["economy"]["work_min"],
            config["economy"]["work_max"]
        )

        users.update_one(
            {
                "guild_id": str(ctx.guild.id),
                "user_id": str(ctx.author.id)
            },
            {
                "$inc": {
                    "money": reward
                }
            },
            upsert=True
        )

        await ctx.send(
            f"💼 Você trabalhou e ganhou **${reward}**!"
        )

    # =========================
    # CONFIG
    # =========================

    @commands.command()
    @commands.has_permissions(administrator=True)
    async def config(self, ctx, option=None, value=None):

        if not option:

            config = get_guild_config(ctx.guild.id)

            embed = discord.Embed(
                title="⚙️ Configurações",
                color=0xFF5B00
            )

            embed.add_field(
                name="Daily",
                value=config["economy"]["daily_reward"],
                inline=False
            )

            embed.add_field(
                name="Work Min",
                value=config["economy"]["work_min"],
                inline=False
            )

            embed.add_field(
                name="Work Max",
                value=config["economy"]["work_max"],
                inline=False
            )

            return await ctx.send(embed=embed)

        if option == "daily":

            guilds.update_one(
                {"guild_id": str(ctx.guild.id)},
                {"$set": {
                    "economy.daily_reward": int(value)
                }}
            )

            await ctx.send(
                f"✅ Daily alterado para ${value}"
            )

async def setup(bot):
    await bot.add_cog(Economy(bot))
