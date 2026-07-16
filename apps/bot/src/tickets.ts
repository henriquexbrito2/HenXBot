import {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    ChannelType,
    TextChannel,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ButtonInteraction
} from "discord.js";

import {
    Guild,
    Ticket
} from "./models";

import {
    createTranscript
} from "./ticketTranscript";

const DEFAULT_CATEGORIES = [
    {
        id: "suporte",
        emoji: "🎫",
        label: "Suporte"
    },
    {
        id: "compras",
        emoji: "💰",
        label: "Compras"
    },
    {
        id: "bugs",
        emoji: "🐛",
        label: "Bugs"
    },
    {
        id: "parcerias",
        emoji: "🤝",
        label: "Parcerias"
    }
];

export async function sendTicketPanel(
    interaction: ChatInputCommandInteraction
) {

    if (!interaction.guild) {
        return interaction.reply({
            content: "Servidor inválido.",
            ephemeral: true
        });
    }

    const channel =
        interaction.options.getChannel(
            "canal",
            true
        );

    if (
        channel.type !== ChannelType.GuildText
    ) {
        return interaction.reply({
            content:
                "Selecione um canal de texto.",
            ephemeral: true
        });
    }

    const embed =
        new EmbedBuilder()
            .setTitle(
                "🎫 Central de Atendimento"
            )
            .setDescription(
                [
                    "Selecione uma categoria abaixo para abrir um ticket.",
                    "",
                    "Nossa equipe responderá o mais rápido possível."
                ].join("\n")
            );

    const menu =
        new StringSelectMenuBuilder()
            .setCustomId(
                "ticket_create"
            )
            .setPlaceholder(
                "Selecione uma categoria"
            )
            .addOptions(
                DEFAULT_CATEGORIES.map(
                    category => ({
                        label:
                            category.label,
                        value:
                            category.id,
                        emoji:
                            category.emoji
                    })
                )
            );

    const row =
        new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(menu);

    await (
        channel as TextChannel
    ).send({
        embeds: [embed],
        components: [row]
    });

    await interaction.reply({
        content:
            "✅ Painel enviado.",
        ephemeral: true
    });

  export async function handleTicketSelect(
    interaction: StringSelectMenuInteraction
) {

    if (
        interaction.customId !==
        "ticket_create"
    ) return;

    if (!interaction.guild) return;

    const selectedCategory =
        interaction.values[0];

    const existingTicket =
        await Ticket.findOne({
            guildId:
                interaction.guild.id,
            creatorId:
                interaction.user.id,
            closed: false
        });

    if (existingTicket) {

        return interaction.reply({
            content:
                "❌ Você já possui um ticket aberto.",
            ephemeral: true
        });

    }

    const guildConfig =
        await Guild.findOne({
            guildId:
                interaction.guild.id
        });

    const parentId =
        guildConfig?.ticketConfig
            ?.categoryParent ||
        guildConfig?.ticketCategory;

    if (!parentId) {

        return interaction.reply({
            content:
                "❌ Nenhuma categoria de tickets foi configurada.",
            ephemeral: true
        });

    }

    const categoryData =
        DEFAULT_CATEGORIES.find(
            category =>
                category.id ===
                selectedCategory
        );

    const ticketChannel =
        await interaction.guild.channels.create(
            {
                name: `ticket-${interaction.user.username}`
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, ""),

                type:
                    ChannelType.GuildText,

                parent: parentId,

                permissionOverwrites: [

                    {
                        id:
                            interaction.guild.id,

                        deny: [
                            PermissionFlagsBits.ViewChannel
                        ]
                    },

                    {
                        id:
                            interaction.user.id,

                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory
                        ]
                    }

                ]

            }
        );

    if (
        guildConfig?.supportRole
    ) {

        await ticketChannel.permissionOverwrites.create(
            guildConfig.supportRole,
            {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            }
        );

    }

    await Ticket.create({

        guildId:
            interaction.guild.id,

        channelId:
            ticketChannel.id,

        creatorId:
            interaction.user.id,

        categoryId:
            selectedCategory,

        categoryName:
            categoryData?.label ||
            "Suporte",

        closed: false

    });

    const closeButton =
        new ButtonBuilder()
            .setCustomId(
                "ticket_close"
            )
            .setLabel(
                "Fechar Ticket"
            )
            .setEmoji("🔒")
            .setStyle(
                ButtonStyle.Danger
            );

    const row =
        new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                closeButton
            );

    const embed =
        new EmbedBuilder()
            .setTitle(
                `${categoryData?.emoji || "🎫"} Ticket Criado`
            )
            .setDescription(
                [
                    `Olá ${interaction.user}!`,
                    "",
                    `Categoria: **${categoryData?.label || "Suporte"}**`,
                    "",
                    "Explique seu problema e aguarde um membro da equipe."
                ].join("\n")
            );

    await ticketChannel.send({

        content:
            guildConfig?.supportRole
                ? `<@&${guildConfig.supportRole}>`
                : undefined,

        embeds: [embed],

        components: [row]

    });

    await interaction.reply({

        content:
            `✅ Ticket criado: ${ticketChannel}`,

        ephemeral: true

    });

}
}
