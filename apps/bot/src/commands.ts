import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    Message
} from "discord.js";

import { User } from "./models";

export async function getOrCreateProfile(userId: string) {

    let profile = await User.findOne({ userId });

    if (!profile) {

        profile = await User.create({
            userId
        });

    }

    return profile;
}

export async function handleSlashCommand(
    interaction: ChatInputCommandInteraction
) {

    const profile = await getOrCreateProfile(
        interaction.user.id
    );

    switch (interaction.commandName) {

        case "ping":

            return interaction.reply("🏓 Pong!");

        case "help":

            return interaction.reply({
                content:
`🤖 HenXBot

/ping
/help
/perfil
/saldo`
            });

        case "saldo":

            return interaction.reply(
                `💰 Carteira: ${profile.coins}\n🏦 Banco: ${profile.bank}`
            );

        case "perfil":

            const embed = new EmbedBuilder()
                .setTitle(`Perfil de ${interaction.user.username}`)
                .addFields(
                    {
                        name: "💰 Moedas",
                        value: String(profile.coins),
                        inline: true
                    },
                    {
                        name: "⭐ Nível",
                        value: String(profile.level),
                        inline: true
                    },
                    {
                        name: "📈 XP",
                        value: String(profile.xp),
                        inline: true
                    }
                );

            return interaction.reply({
                embeds: [embed]
            });

    }

}

export async function handlePrefixCommand(
    message: Message,
    prefix: string
) {

    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/);

    const command = args.shift()?.toLowerCase();

    const profile = await getOrCreateProfile(
        message.author.id
    );

    switch (command) {

        case "ping":

            return message.reply("🏓 Pong!");

        case "help":

            return message.reply(
`🤖 HenXBot

${prefix}ping
${prefix}help
${prefix}perfil
${prefix}saldo`
            );

        case "saldo":

            return message.reply(
                `💰 Carteira: ${profile.coins}\n🏦 Banco: ${profile.bank}`
            );

        case "perfil":

            return message.reply(
`👤 Perfil

💰 Moedas: ${profile.coins}
⭐ Nível: ${profile.level}
📈 XP: ${profile.xp}`
            );

    }

}
