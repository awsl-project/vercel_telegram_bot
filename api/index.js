import express from "express";
import { Telegraf } from "telegraf";
const { message } = require('telegraf/filters')

const bot = new Telegraf(process.env.BOT_TOKEN)
const app = express();
const webhook = bot.webhookCallback("/bot")

app.use(async (req, res, next) => {
    return webhook(req, res, next);
});

bot.command("ping", ctx => ctx.reply("pong"))
bot.command("start", ctx => ctx.reply("type command se to use"))
const send_awsl = async (ctx) => {
    const res = await fetch(`${process.env.API_URL}/v2/random`)
    await ctx.reply(await res.text())
}
bot.command("se", send_awsl)
bot.command("sese", send_awsl)
bot.command("awsl", send_awsl)

const send_moyu = async (ctx) => {
    const res = await fetch(`${process.env.API_URL}/moyu`)
    await ctx.reply(await res.text())
}
bot.command("moyu", send_moyu)
bot.command("mo", send_moyu)
bot.command("moyuban", send_moyu)

const send_mjx = async (ctx) => {
    const res = await fetch(`${process.env.UOMG_URL}`)
    const data = await res.json()
    await ctx.reply(data["imgurl"])
}
bot.command("maijiaxiu", send_mjx)
bot.command("mjx", send_mjx)

async function run(model, input) {
    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/${model}`,
        {
            headers: { Authorization: `Bearer ${process.env.CF_AI_TOKEN}` },
            method: "POST",
            body: JSON.stringify(input),
        }
    );
    const result = await response.json();
    return result;
}

bot.on(message('text'), async (ctx) => {
    if (!ctx.message.text.startsWith(process.env.BOT_NAME)) {
        return
    }
    const prompt = ctx.message.text.slice(process.env.BOT_NAME.length).trim();
    if (!prompt || prompt.length === 0) {
        console.error("Empty prompt")
        return
    }
    const response = await run("@cf/meta/llama-2-7b-chat-int8", {
        prompt: prompt
    });
    const reply = response?.result?.response;
    if (!reply) {
        console.error("Empty reply from AI")
        return
    }
    ctx.reply(reply)
})


app.get("/", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" href="https://telegram.org/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Telegram Bot</title>
</head>

<body>
    <h1>Telegram Bot</h1>
    <p>Bot is running</p>
</body>
</html>
    `);
});

// app.listen(3000, () => console.log("Listening on port", 3000));

module.exports = app;
