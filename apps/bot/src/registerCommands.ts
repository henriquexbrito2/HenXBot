import {
    REST,
    Routes,
    SlashCommandBuilder
} from "discord.js";

import dotenv from "dotenv";

dotenv.config();

const commands = [

    // Utilidade

    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Verifica a latência"),

    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Mostra os comandos do bot"),

    // Perfil

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
        .setDescription("Veja o top 10"),

    // Moderação

    new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Adiciona um aviso")
        .addUserOption(option =>
            option
                .setName("usuario")
                .setDescription("Usuário")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("motivo")
                .setDescription("Motivo")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("warns")
        .setDescription("Ver avisos de um usuário")
        .addUserOption(option =>
            option
                .setName("usuario")
                .setDescription("Usuário")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("removewarn")
        .setDescription("Remove um aviso")
        .addUserOption(option =>
            option
                .setName("usuario")
                .setDescription("Usuário")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("numero")
                .setDescription("Número do aviso")
                .setRequired(true)
        ),

    // Kick

    new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Expulsa um usuário")
        .addUserOption(option =>
            option
                .setName("usuario")
                .setDescription("Usuário")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("motivo")
                .setDescription("Motivo")
                .setRequired(false)
        ),

    // Ban

    new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bane um usuário")
        .addUserOption(option =>
            option
                .setName("usuario")
                .setDescription("Usuário")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("motivo")
                .setDescription("Motivo")
                .setRequired(false)
        ),

    // Timeout

    new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Aplica timeout")
        .addUserOption(option =>
            option
                .setName("usuario")
                .setDescription("Usuário")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("minutos")
                .setDescription("Duração")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("motivo")
                .setDescription("Motivo")
                .setRequired(false)
        ),

    // Tickets

    new SlashCommandBuilder()
        .setName("ticket-painel")
        .setDescription("Envia o painel de tickets"),

    new SlashCommandBuilder()
        .setName("ticket-fechar")
        .setDescription("Fecha o ticket atual")

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
