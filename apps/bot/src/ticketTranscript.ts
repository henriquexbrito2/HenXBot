import {
TextChannel,
Collection,
Message
} from "discord.js";

function escapeHtml(text: string): string {


return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");


}

function formatDate(date: Date): string {


return new Intl.DateTimeFormat(
    "pt-BR",
    {
        dateStyle: "short",
        timeStyle: "medium"
    }
).format(date);


}

async function fetchAllMessages(
channel: TextChannel
): Promise<Message[]> {


let messages: Message[] = [];

let lastId: string | undefined;

while (true) {

    const fetched: Collection<
        string,
        Message
    > = await channel.messages.fetch({

        limit: 100,
        before: lastId

    });

    if (!fetched.size) {
        break;
    }

    messages.push(
        ...Array.from(
            fetched.values()
        )
    );

    lastId =
        fetched.last()?.id;

}

return messages.sort(
    (a, b) =>
        a.createdTimestamp -
        b.createdTimestamp
);


}

export async function createTranscript(
channel: TextChannel
): Promise<string> {


const messages =
    await fetchAllMessages(
        channel
    );

const htmlMessages =
    messages.map(message => {

        const author =
            escapeHtml(
                message.author.tag
            );

        const content =
            escapeHtml(
                message.content ||
                "[Sem conteúdo]"
            );

        const timestamp =
            formatDate(
                message.createdAt
            );

        const attachments =
            message.attachments
                .map(
                    attachment =>
                        `
                        <div class="attachment">
                            <a href="${attachment.url}" target="_blank">
                                ${attachment.name}
                            </a>
                        </div>
                        `
                )
                .join("");

        return `
            <div class="message">

                <div class="header">
                    <span class="author">
                        ${author}
                    </span>

                    <span class="time">
                        ${timestamp}
                    </span>
                </div>

                <div class="content">
                    ${content}
                </div>

                ${attachments}

            </div>
        `;

    }).join("");

return `


<!DOCTYPE html>

<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<title>
Transcript - ${channel.name}
</title>

<style>

body {

    background: #1e1f22;
    color: #ffffff;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    margin: 0;
    padding: 20px;

}

.header-page {

    text-align: center;
    margin-bottom: 30px;

}

.channel {

    color: #ff7b00;
    font-size: 28px;
    font-weight: bold;

}

.message {

    background: #2b2d31;

    padding: 12px;

    margin-bottom: 10px;

    border-radius: 8px;

}

.header {

    display: flex;

    justify-content:
        space-between;

    margin-bottom: 8px;

}

.author {

    color: #ff7b00;
    font-weight: bold;

}

.time {

    color: #949ba4;
    font-size: 12px;

}

.content {

    white-space:
        pre-wrap;

    word-break:
        break-word;

}

.attachment {

    margin-top: 8px;

}

.attachment a {

    color: #4ea6ff;

    text-decoration:
        none;

}

</style>

</head>

<body>

<div class="header-page">


<div class="channel">
    Transcript
</div>

<p>
    Canal:
    #${channel.name}
</p>

<p>
    Gerado em:
    ${formatDate(
        new Date()
    )}
</p>
```

</div>

${htmlMessages}

</body>

</html>
`;

}
