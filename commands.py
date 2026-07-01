import discord
from discord.ext import commands
from database import users, guilds, get_guild_config
from systems import generate_work_reward
import datetime
import asyncio


class HenXBot(commands.Cog):

    def __init__(self, bot):
        self.bot = bot

    # =========================
    # FUNÇÕES AUXILIARES
    # =========================

    def get_user(self, guild_id, user_id):

        user = users.find_one({
            "guild_id": str(guild_id),
            "user_id": str(user_id)
        })

        if not user:

            user = {
                "guild_id": str(guild_id),
                "user_id": str(user_id),
                "money": 0,
                "xp": 0,
                "level": 1,
                "last_daily": None
            }

            users.insert_one(user)

        return user

    # =========================
    # PING
    # =========================

    @commands.command()
    async def ping(self, ctx):

        await ctx.send(
            f"🏓 Pong! {round(self.bot.latency * 1000)}ms"
        )

    # =========================
    # HELP
    # =========================

    @commands.command()
    async def help(self, ctx):

        embed = discord.Embed(
            title="📚 HenXBot",
            color=0xFF5B00
        )

        embed.add_field(
            name="⚙️ Geral",
            value="""
hxb!ping
hxb!help
            """,
            inline=False
        )

        embed.add_field(
            name="💰 Economia",
            value="""
hxb!balance
hxb!daily
hxb!work
            """,
            inline=False
        )

        embed.add_field(
            name="🎫 Tickets",
            value="""
hxb!ticketsetup
hxb!close
            """,
            inline=False
        )

        embed.add_field(
            name="🛠 Config",
            value="""
hxb!config
hxb!config daily 500
hxb!config workmin 100
hxb!config workmax 1000
            """,
            inline=False
        )

        await ctx.send(embed=embed)

    # =========================
    # BALANCE
    # =========================

    @commands.command()
    async def balance(self, ctx):

        user = self.get_user(
            ctx.guild.id,
            ctx.author.id
        )

        embed = discord.Embed(
            title="💰 Carteira",
            description=f"Saldo: ${user['money']}",
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

        user = self.get_user(
            ctx.guild.id,
            ctx.author.id
        )

        now = datetime.datetime.utcnow()

        if user.get("last_daily"):

            diff = now - user["last_daily"]

            if diff.total_seconds() < 86400:

                return await ctx.send(
                    "⏳ Você já coletou seu daily."
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
            f"🎁 Você recebeu ${reward}"
        )

    # =========================
    # WORK
    # =========================

    @commands.command()
    async def work(self, ctx):

        config = get_guild_config(
            ctx.guild.id
        )

        reward = generate_work_reward(
            config["economy"]["work_min"],
            config["economy"]["work_max"]
        )

        self.get_user(
            ctx.guild.id,
            ctx.author.id
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
            }
        )

        await ctx.send(
            f"💼 Você trabalhou e ganhou ${reward}"
        )

    # =========================
    # CONFIG
    # =========================

    @commands.command()
    @commands.has_permissions(administrator=True)
    async def config(self, ctx, option=None, *, value=None):

        config_data = get_guild_config(
            ctx.guild.id
        )

        if not option:

            embed = discord.Embed(
                title="⚙️ Configurações",
                color=0xFF5B00
            )

            embed.add_field(
                name="Daily",
                value=config_data["economy"]["daily_reward"],
                inline=False
            )

            embed.add_field(
                name="Work Min",
                value=config_data["economy"]["work_min"],
                inline=False
            )

            embed.add_field(
                name="Work Max",
                value=config_data["economy"]["work_max"],
                inline=False
            )

            return await ctx.send(
                embed=embed
            )

        if option == "daily":

            guilds.update_one(
                {
                    "guild_id": str(ctx.guild.id)
                },
                {
                    "$set": {
                        "economy.daily_reward": int(value)
                    }
                }
            )

            return await ctx.send(
                f"✅ Daily = ${value}"
            )

        if option == "workmin":

            guilds.update_one(
                {
                    "guild_id": str(ctx.guild.id)
                },
                {
                    "$set": {
                        "economy.work_min": int(value)
                    }
                }
            )

            return await ctx.send(
                f"✅ Work Min = ${value}"
            )

        if option == "workmax":

            guilds.update_one(
                {
                    "guild_id": str(ctx.guild.id)
                },
                {
                    "$set": {
                        "economy.work_max": int(value)
                    }
                }
            )

            return await ctx.send(
                f"✅ Work Max = ${value}"
            )

        if option == "ticketmessage":

            guilds.update_one(
                {
                    "guild_id": str(ctx.guild.id)
                },
                {
                    "$set": {
                        "tickets.message": value
                    }
                }
            )

            return await ctx.send(
                "✅ Mensagem do ticket atualizada."
            )

    # =========================
    # TICKET SETUP
    # =========================

    @commands.command()
    @commands.has_permissions(administrator=True)
    async def ticketsetup(self, ctx):

        embed = discord.Embed(
            title="🎫 Suporte",
            description="Clique no botão abaixo para abrir um ticket.",
            color=0xFF5B00
        )

        view = TicketView()

        await ctx.send(
            embed=embed,
            view=view
        )

    # =========================
    # CLOSE
    # =========================

    @commands.command()
    async def close(self, ctx):

        if not ctx.channel.name.startswith(
            "ticket-"
        ):
            return await ctx.send(
                "❌ Este não é um ticket."
            )

        await ctx.send(
            "🔒 Fechando ticket..."
        )

        await asyncio.sleep(3)

        await ctx.channel.delete()


class TicketView(discord.ui.View):

    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(
        label="Abrir Ticket",
        emoji="🎫",
        style=discord.ButtonStyle.green
    )
    async def open_ticket(
        self,
        interaction: discord.Interaction,
        button: discord.ui.Button
    ):

        guild = interaction.guild

        existing = discord.utils.get(
            guild.channels,
            name=f"ticket-{interaction.user.id}"
        )

        if existing:

            return await interaction.response.send_message(
                "❌ Você já possui um ticket.",
                ephemeral=True
            )

        config = get_guild_config(
            guild.id
        )

        channel = await guild.create_text_channel(
            name=f"ticket-{interaction.user.id}"
        )

        await channel.set_permissions(
            guild.default_role,
            read_messages=False
        )

        await channel.set_permissions(
            interaction.user,
            read_messages=True,
            send_messages=True
        )

        embed = discord.Embed(
            title="🎫 Ticket Aberto",
            description=config["tickets"]["message"],
            color=0xFF5B00
        )

        await channel.send(
            interaction.user.mention,
            embed=embed
        )

        await interaction.response.send_message(
            f"✅ Ticket criado: {channel.mention}",
            ephemeral=True
        )


async def setup(bot):
    await bot.add_cog(HenXBot(bot))
