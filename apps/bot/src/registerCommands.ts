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
        .setDescription("Mostra a ajuda do bot"),

    new SlashCommandBuilder()
        .setName("perfil")
        .setDescription("Mostra seu perfil"),

    new SlashCommandBuilder()
        .setName("saldo")
        .setDescription("Mostra seu saldo"),

    new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Receba sua recompensa diária"),

    new SlashCommandBuilder()
        .setName("work")
        .setDescription("Trabalhe para ganhar moedas"),

    new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Veja sua posição no ranking"),

    new SlashCommandBuilder()
        .setName("top")
        .setDescription("Veja o top 10 do servidor")

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

        console.log(
            "✅ Comandos registrados"
        );

    } catch (error) {

        console.error(error);

    }

}

register();
