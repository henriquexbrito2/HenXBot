import {
    Client,
    GatewayIntentBits,
    Events
} from "discord.js";

import dotenv from "dotenv";

import { connectDatabase } from "./database";

import {
    handleSlashCommand,
    handlePrefixCommand,
    getOrCreateProfile
} from "./commands";

dotenv.config();

const client = new Client({

    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]

});

const DEFAULT_PREFIX = "hxb!";

const xpCooldown = new Map<
    string,
    number
>();

client.once(
    Events.ClientReady,
    async () => {

        console.log(
            `🤖 ${client.user?.tag} online`
        );

        await connectDatabase();

    }
);

client.on(
    Events.InteractionCreate,
    async interaction => {

        if (
            !interaction.isChatInputCommand()
        ) return;

        await handleSlashCommand(
            interaction
        );

    }
);

client.on(
    Events.MessageCreate,
    async message => {

        if (
            message.author.bot
        ) return;

        const profile =
            await getOrCreateProfile(
                message.author.id
            );

        const now = Date.now();

        const cooldown =
            xpCooldown.get(
                message.author.id
            );

        if (
            !cooldown ||
            now - cooldown > 60000
        ) {

            const xpGain =
                Math.floor(
                    Math.random() * 11
                ) + 5;

            profile.xp += xpGain;

            const requiredXp =
                profile.level * 100;

            if (
                profile.xp >= requiredXp
            ) {

                profile.level += 1;

                profile.xp -=
                    requiredXp;

                await message.channel.send(
                    `🎉 ${message.author}, você alcançou o nível ${profile.level}!`
                );

            }

            await profile.save();

            xpCooldown.set(
                message.author.id,
                now
            );

        }

        if (
            !message.content.startsWith(
                DEFAULT_PREFIX
            )
        ) return;

        await handlePrefixCommand(
            message,
            DEFAULT_PREFIX
        );

    }
);

client.login(
    process.env.TOKEN
);
