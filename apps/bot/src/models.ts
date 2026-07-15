import mongoose from "mongoose";

const WarningSchema = new mongoose.Schema({

    moderatorId: {
        type: String,
        required: true
    },

    reason: {
        type: String,
        default: "Nenhum motivo informado"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

const UserSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
        unique: true
    },

    coins: {
        type: Number,
        default: 0
    },

    bank: {
        type: Number,
        default: 0
    },

    xp: {
        type: Number,
        default: 0
    },

    level: {
        type: Number,
        default: 1
    },

    reputation: {
        type: Number,
        default: 0
    },

    marriedTo: {
        type: String,
        default: null
    },

    achievements: {
        type: [String],
        default: []
    },

    inventory: {
        type: [String],
        default: []
    },

    warnings: {
        type: [WarningSchema],
        default: []
    },

    lastDaily: {
        type: Date,
        default: null
    },

    lastWork: {
        type: Date,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

const GuildSchema = new mongoose.Schema({

    guildId: {
        type: String,
        required: true,
        unique: true
    },

    prefix: {
        type: String,
        default: "hxb!"
    },

    logsChannel: {
        type: String,
        default: null
    },

    modLogsChannel: {
        type: String,
        default: null
    },

    ticketLogsChannel: {
        type: String,
        default: null
    },

    welcomeChannel: {
        type: String,
        default: null
    },

    ticketCategory: {
        type: String,
        default: null
    },

    supportRole: {
        type: String,
        default: null
    },

    automod: {
        type: Boolean,
        default: false
    },

    economyEnabled: {
        type: Boolean,
        default: true
    },

    xpEnabled: {
        type: Boolean,
        default: true
    },

    moderationEnabled: {
        type: Boolean,
        default: true
    },

    ticketsEnabled: {
        type: Boolean,
        default: true
    }

});

export const User =
    mongoose.models.User ||
    mongoose.model("User", UserSchema);

export const Guild =
    mongoose.models.Guild ||
    mongoose.model("Guild", GuildSchema);
