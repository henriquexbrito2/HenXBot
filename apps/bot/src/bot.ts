import {
    Client,
    GatewayIntentBits,
    Events
} from "discord.js";

import dotenv from "dotenv";

import { connectDatabase } from "./database";
import {
    handleSlashCommand,
    handlePrefixCommand
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
