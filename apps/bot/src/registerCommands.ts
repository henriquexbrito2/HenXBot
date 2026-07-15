import {
REST,
Routes,
SlashCommandBuilder
} from "discord.js";

import dotenv from "dotenv";

dotenv.config();

const commands = [

```
new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Verifica a latência"),

new SlashCommandBuilder()
    .setName("perfil")
    .setDescription("Mostra seu perfil")
```

].map(command => command.toJSON());

const rest = new REST({
version: "10"
}).setToken(process.env.TOKEN!);

async function register() {

```
await rest.put(
    Routes.applicationCommands(
        process.env.CLIENT_ID!
    ),
    {
        body: commands
    }
);

console.log("✅ Comandos registrados");
```

}

register();
