import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits
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
            .setDescription(
                `${target}`
            )
            .addFields(
                {
                    name: "Moderador",
                    value:
                        interaction.user.tag
                },
                {
                    name: "Motivo",
                    value: reason
                },
                {
                    name: "Total de Avisos",
                    value:
                        String(
                            profile.warnings.length
                        )
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
                    `Warn #${number} removido de ${target}`
                )
        ]
    });

}
