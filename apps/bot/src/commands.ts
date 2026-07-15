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

function getRequiredXp(level: number): number {
    return level * 100;
}

async function checkLevelUp(profile: any) {

    const requiredXp = getRequiredXp(
        profile.level
    );

    if (profile.xp >= requiredXp) {

        profile.level += 1;
        profile.xp -= requiredXp;

        await profile.save();

        return true;
    }

    return false;
}

export async function handleSlashCommand(
    interaction: ChatInputCommandInteraction
) {

    const profile = await getOrCreateProfile(
        interaction.user.id
    );

    switch (interaction.commandName) {

        case "ping":

            return interaction.reply(
                "🏓 Pong!"
            );

        case "help":

            return interaction.reply({
                content:
`🤖 HenXBot

/ping
/help
/perfil
/saldo
/daily
/work
/rank
/top`
            });

        case "saldo":

            return interaction.reply(
                `💰 Carteira: ${profile.coins}
🏦 Banco: ${profile.bank}`
            );

        case "daily": {

            const now = Date.now();

            if (
                profile.lastDaily &&
                now - profile.lastDaily.getTime()
                < 86400000
            ) {

                return interaction.reply({
                    content:
                        "⏳ Você já coletou seu daily hoje.",
                    ephemeral: true
                });

            }

            profile.coins += 500;
            profile.lastDaily = new Date();

            await profile.save();

            return interaction.reply(
                "🎁 Você recebeu 500 moedas!"
            );
        }

        case "work": {

            const now = Date.now();

            if (
                profile.lastWork &&
                now - profile.lastWork.getTime()
                < 3600000
            ) {

                return interaction.reply({
                    content:
                        "⏳ Você já trabalhou recentemente.",
                    ephemeral: true
                });

            }

            const reward =
                Math.floor(
                    Math.random() * 201
                ) + 100;

            profile.coins += reward;
            profile.lastWork = new Date();

            await profile.save();

            return interaction.reply(
                `💼 Você trabalhou e ganhou ${reward} moedas!`
            );
        }

        case "rank": {

            const users =
                await User.find()
                    .sort({
                        level: -1,
                        xp: -1
                    });

            const position =
                users.findIndex(
                    (u: any) =>
                        u.userId ===
                        interaction.user.id
                ) + 1;

            return interaction.reply(
                `🏆 Rank: #${position}
⭐ Nível: ${profile.level}
📈 XP: ${profile.xp}`
            );
        }

        case "top": {

            const users =
                await User.find()
                    .sort({
                        level: -1,
                        xp: -1
                    })
                    .limit(10);

            let leaderboard =
                "🏆 Top 10 Jogadores\n\n";

            users.forEach(
                (user: any, index: number) => {

                    leaderboard +=
                        `${index + 1}. <@${user.userId}> • Nível ${user.level}\n`;

                }
            );

            return interaction.reply(
                leaderboard
            );
        }

        case "perfil": {

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        `Perfil de ${interaction.user.username}`
                    )
                    .addFields(
                        {
                            name: "💰 Moedas",
                            value:
                                String(
                                    profile.coins
                                ),
                            inline: true
                        },
                        {
                            name: "🏦 Banco",
                            value:
                                String(
                                    profile.bank
                                ),
                            inline: true
                        },
                        {
                            name: "⭐ Nível",
                            value:
                                String(
                                    profile.level
                                ),
                            inline: true
                        },
                        {
                            name: "📈 XP",
                            value:
                                String(
                                    profile.xp
                                ),
                            inline: true
                        }
                    );

            return interaction.reply({
                embeds: [embed]
            });
        }

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

    const command =
        args.shift()?.toLowerCase();

    const profile =
        await getOrCreateProfile(
            message.author.id
        );

    switch (command) {

        case "ping":

            return message.reply(
                "🏓 Pong!"
            );

        case "help":

            return message.reply(
`🤖 HenXBot

${prefix}ping
${prefix}help
${prefix}perfil
${prefix}saldo
${prefix}daily
${prefix}work
${prefix}rank
${prefix}top`
            );

        case "saldo":

            return message.reply(
                `💰 Carteira: ${profile.coins}
🏦 Banco: ${profile.bank}`
            );

        case "daily": {

            const now = Date.now();

            if (
                profile.lastDaily &&
                now - profile.lastDaily.getTime()
                < 86400000
            ) {

                return message.reply(
                    "⏳ Você já coletou seu daily hoje."
                );

            }

            profile.coins += 500;
            profile.lastDaily =
                new Date();

            await profile.save();

            return message.reply(
                "🎁 Você recebeu 500 moedas!"
            );
        }

        case "work": {

            const now = Date.now();

            if (
                profile.lastWork &&
                now - profile.lastWork.getTime()
                < 3600000
            ) {

                return message.reply(
                    "⏳ Você já trabalhou recentemente."
                );

            }

            const reward =
                Math.floor(
                    Math.random() * 201
                ) + 100;

            profile.coins += reward;
            profile.lastWork =
                new Date();

            await profile.save();

            return message.reply(
                `💼 Você ganhou ${reward} moedas!`
            );
        }

        case "rank": {

            const users =
                await User.find()
                    .sort({
                        level: -1,
                        xp: -1
                    });

            const position =
                users.findIndex(
                    (u: any) =>
                        u.userId ===
                        message.author.id
                ) + 1;

            return message.reply(
                `🏆 Rank: #${position}
⭐ Nível: ${profile.level}
📈 XP: ${profile.xp}`
            );
        }

        case "top": {

            const users =
                await User.find()
                    .sort({
                        level: -1,
                        xp: -1
                    })
                    .limit(10);

            let leaderboard =
                "🏆 Top 10 Jogadores\n\n";

            users.forEach(
                (
                    user: any,
                    index: number
                ) => {

                    leaderboard +=
                        `${index + 1}. ${user.userId} • Nível ${user.level}\n`;

                }
            );

            return message.reply(
                leaderboard
            );
        }

        case "perfil":

            return message.reply(
`👤 Perfil

💰 Moedas: ${profile.coins}
🏦 Banco: ${profile.bank}
⭐ Nível: ${profile.level}
📈 XP: ${profile.xp}`
            );

    }

}
