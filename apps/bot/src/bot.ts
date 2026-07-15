import {
Client,
GatewayIntentBits,
Events
} from "discord.js";

import dotenv from "dotenv";
import { connectDatabase } from "./database";

dotenv.config();

const client = new Client({

```
intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
]
```

});

client.once(Events.ClientReady, async () => {

```
console.log(`🤖 ${client.user?.tag} online`);

await connectDatabase();
```

});

client.login(process.env.TOKEN);
