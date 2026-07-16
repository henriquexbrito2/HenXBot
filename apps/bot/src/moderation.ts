ts
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    GuildMember
} from "discord.js";

import { User } from "./models";

async function getProfile(userId: string) {

    let profile = await User.findOne({
        userId
    });

    if (!profile) {

        profile = await User.create({
            userId
        });

    }

    return profile;
}

export async function handleWarn(
    interaction: ChatInputCommandInteraction
) {

    if (
        !interaction.memberPermissions?.has(
            PermissionFlagsBits.ModerateMembers
        )
    ) {

        return interaction.reply({
            content:
                "❌ Você não possui permissão para usar este comando.",
            ephemeral: true
        });

    }

    const target =
        interaction.options.getUser(
            "usuario",
            true
        );

    const reason =
        interaction.options.getString(
            "motivo",
            true
        );

    const profile =
        await getProfile(
            target.id
        );

    profile.warnings.push({
        moderatorId:
            interaction.user.id,
        reason
    });

    await profile.save();

    const embed =
        new EmbedBuilder()
            .setTitle(
                "⚠️ Aviso Aplicado"
            )
            .addFields(
                {
                    name: "Usuário",
                    value: `<@${target.id}>`,
                    inline: true
                },
                {
                    name: "Moderador",
                    value: `<@${interaction.user.id}>`,
                    inline: true
                },
                {
                    name: "Total de Avisos",
                    value: String(
                        profile.warnings.length
                    ),
                    inline: true
                },
                {
                    name: "Motivo",
                    value: reason
                }
            );

    return interaction.reply({
        embeds: [embed]
    });

}

export async function handleWarns(
    interaction: ChatInputCommandInteraction
) {

    const target =
        interaction.options.getUser(
            "usuario",
            true
        );

    const profile =
        await getProfile(
            target.id
        );

    const embed =
        new EmbedBuilder()
            .setTitle(
                `⚠️ Avisos de ${target.username}`
            );

    if (
        profile.warnings.length === 0
    ) {

        embed.setDescription(
            "Nenhum aviso encontrado."
        );

    } else {

        profile.warnings.forEach(
            (
                warn: any,
                index: number
            ) => {

                embed.addFields({
                    name:
                        `Warn #${index + 1}`,
                    value:
                        `Motivo: ${warn.reason}\nModerador: <@${warn.moderatorId}>`
                });

            }
        );

    }

    return interaction.reply({
        embeds: [embed]
    });

}

export async function handleRemoveWarn(
    interaction: ChatInputCommandInteraction
) {

    if (
        !interaction.memberPermissions?.has(
            PermissionFlagsBits.ModerateMembers
        )
    ) {

        return interaction.reply({
            content:
                "❌ Você não possui permissão.",
            ephemeral: true
        });

    }

    const target =
        interaction.options.getUser(
            "usuario",
            true
        );

    const number =
        interaction.options.getInteger(
            "numero",
            true
        );

    const profile =
        await getProfile(
            target.id
        );

    if (
        number < 1 ||
        number >
        profile.warnings.length
    ) {

        return interaction.reply({
            content:
                "❌ Aviso inválido.",
            ephemeral: true
        });

    }

    profile.warnings.splice(
        number - 1,
        1
    );

    await profile.save();

    return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle(
                    "✅ Aviso Removido"
                )
                .setDescription(
                    `Warn #${number} removido de <@${target.id}>`
                )
        ]
    });

}

export async function handleKick(
    interaction: ChatInputCommandInteraction
) {

    if (
        !interaction.memberPermissions?.has(
            PermissionFlagsBits.KickMembers
        )
    ) {

        return interaction.reply({
            content:
                "❌ Você não possui permissão.",
            ephemeral: true
        });

    }

    const member =
        interaction.options.getMember(
            "usuario"
        ) as GuildMember;

    const reason =
        interaction.options.getString(
            "motivo"
        ) || "Nenhum motivo informado";

    if (!member) {

        return interaction.reply({
            content:
                "❌ Usuário não encontrado.",
            ephemeral: true
        });

    }

    await member.kick(reason);

    return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle(
                    "👢 Usuário Expulso"
                )
                .addFields(
                    {
                        name: "Usuário",
                        value: `<@${member.id}>`
                    },
                    {
                        name: "Motivo",
                        value: reason
                    }
                )
        ]
    });

}

export async function handleBan(
    interaction: ChatInputCommandInteraction
) {

    if (
        !interaction.memberPermissions?.has(
            PermissionFlagsBits.BanMembers
        )
    ) {

        return interaction.reply({
            content:
                "❌ Você não possui permissão.",
            ephemeral: true
        });

    }

    const target =
        interaction.options.getUser(
            "usuario",
            true
        );

    const reason =
        interaction.options.getString(
            "motivo"
        ) || "Nenhum motivo informado";

    await interaction.guild?.members.ban(
        target.id,
        {
            reason
        }
    );

    return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle(
                    "🔨 Usuário Banido"
                )
                .addFields(
                    {
                        name: "Usuário",
                        value: `<@${target.id}>`
                    },
                    {
                        name: "Motivo",
                        value: reason
                    }
                )
        ]
    });

}

export async function handleTimeout(
    interaction: ChatInputCommandInteraction
) {

    if (
        !interaction.memberPermissions?.has(
            PermissionFlagsBits.ModerateMembers
        )
    ) {

        return interaction.reply({
            content:
                "❌ Você não possui permissão.",
            ephemeral: true
        });

    }

    const member =
        interaction.options.getMember(
            "usuario"
        ) as GuildMember;

    const minutes =
        interaction.options.getInteger(
            "minutos",
            true
        );

    const reason =
        interaction.options.getString(
            "motivo"
        ) || "Nenhum motivo informado";

    if (!member) {

        return interaction.reply({
            content:
                "❌ Usuário não encontrado.",
            ephemeral: true
        });

    }

    await member.timeout(
        minutes * 60 * 1000,
        reason
    );

    return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle(
                    "⏳ Timeout Aplicado"
                )
                .addFields(
                    {
                        name: "Usuário",
                        value: `<@${member.id}>`
                    },
                    {
                        name: "Duração",
                        value:
                            `${minutes} minuto(s)`
                    },
                    {
                        name: "Motivo",
                        value: reason
                    }
                )
        ]
    });

}
```
