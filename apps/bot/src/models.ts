import mongoose from "mongoose";

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
    }

});

export const User =
    mongoose.models.User ||
    mongoose.model("User", UserSchema);

export const Guild =
    mongoose.models.Guild ||
    mongoose.model("Guild", GuildSchema);
