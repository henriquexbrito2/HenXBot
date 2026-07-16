const TicketQuestionSchema = new mongoose.Schema({

    label: {
        type: String,
        required: true
    },

    placeholder: {
        type: String,
        default: ""
    },

    required: {
        type: Boolean,
        default: true
    },

    maxLength: {
        type: Number,
        default: 200
    }

});

const TicketCategorySchema = new mongoose.Schema({

    categoryId: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    emoji: {
        type: String,
        default: "🎫"
    },

    description: {
        type: String,
        default: ""
    },

    supportRoles: {
        type: [String],
        default: []
    },

    priority: {
        type: Number,
        default: 1
    },

    autoMessage: {
        type: String,
        default: ""
    },

    questions: {
        type: [TicketQuestionSchema],
        default: []
    }

});

const TicketButtonSchema = new mongoose.Schema({

    customId: {
        type: String,
        required: true
    },

    label: {
        type: String,
        required: true
    },

    emoji: {
        type: String,
        default: null
    },

    style: {
        type: String,
        default: "Primary"
    },

    enabled: {
        type: Boolean,
        default: true
    }

});

const TicketConfigSchema = new mongoose.Schema({

    enabled: {
        type: Boolean,
        default: true
    },

    panelChannel: {
        type: String,
        default: null
    },

    logsChannel: {
        type: String,
        default: null
    },

    transcriptChannel: {
        type: String,
        default: null
    },

    categoryParent: {
        type: String,
        default: null
    },

    maxTicketsPerUser: {
        type: Number,
        default: 1
    },

    cooldownMinutes: {
        type: Number,
        default: 0
    },

    categories: {
        type: [TicketCategorySchema],
        default: []
    },

    buttons: {
        type: [TicketButtonSchema],
        default: []
    }

});
