import {
    REST,
    Routes,
    SlashCommandBuilder
} from "discord.js";

import dotenv from "dotenv";

dotenv.config();

const commands = [

    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Verifica a latência"),

    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Mostra a ajuda"),

    new SlashCommandBuilder()
        .setName("perfil")
        .setDescription("Mostra seu perfil"),

    new SlashCommandBuilder()
        .setName("saldo")
        .setDescription("Mostra seu saldo")

].map(command => command.toJSON());

const rest = new REST({
    version: "10"
}).setToken(process.env.TOKEN!);

async function register() {

    try {

        await rest.put(
            Routes.applicationCommands(
                process.env.CLIENT_ID!
            ),
            {
                body: commands
            }
        );

        console.log("✅ Comandos registrados");

    } catch (error) {

        console.error(error);

    }

}

register();
