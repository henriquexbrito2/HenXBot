import mongoose from "mongoose";

const WarningSchema = new mongoose.Schema({

```
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
```

});

const TicketQuestionSchema = new mongoose.Schema({

```
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
```

});

const TicketCategorySchema = new mongoose.Schema({

```
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
```

});

const TicketButtonSchema = new mongoose.Schema({

```
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
```

});

const TicketConfigSchema = new mongoose.Schema({

```
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
```

});

const TicketSchema = new mongoose.Schema({

```
guildId: {
    type: String,
    required: true
},

channelId: {
    type: String,
    required: true
},

creatorId: {
    type: String,
    required: true
},

categoryId: {
    type: String,
    default: null
},

categoryName: {
    type: String,
    default: "Suporte"
},

assignedTo: {
    type: String,
    default: null
},

closedBy: {
    type: String,
    default: null
},

closed: {
    type: Boolean,
    default: false
},

rating: {
    type: Number,
    default: null
},

transcriptUrl: {
    type: String,
    default: null
},

createdAt: {
    type: Date,
    default: Date.now
},

closedAt: {
    type: Date,
    default: null
}
```

});

const UserSchema = new mongoose.Schema({

```
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
```

});

const GuildSchema = new mongoose.Schema({

```
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
},

ticketConfig: {
    type: TicketConfigSchema,
    default: () => ({})
}
```

});

export const User =
mongoose.models.User ||
mongoose.model("User", UserSchema);

export const Guild =
mongoose.models.Guild ||
mongoose.model("Guild", GuildSchema);

export const Ticket =
mongoose.models.Ticket ||
mongoose.model("Ticket", TicketSchema);
