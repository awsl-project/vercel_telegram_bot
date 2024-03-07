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
    res.send("Express on Vercel");
});

app.get("/favicon.ico", (req, res) => {
    res.set('Content-Type', 'image/svg+xml');
    const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
viewBox="0 0 16 16">
<g fill="none">
    <path
        d="M5.109 5.56l-.765-.987C3.532 3.525 4.28 2 5.605 2c.323 0 .637.097.903.28l2.1 1.44a5.68 5.68 0 0 1 .91-.953c.524-.426 1.195-.772 1.985-.767c1.544.01 2.657 1.213 3.242 2.024c.573.792.115 1.777-.692 2.073l-2.232.818l-3.106 4.48c-.938 1.353-3.054.428-2.697-1.18l.312-1.407l-3.105.875A1.75 1.75 0 0 1 1 8V5.16c0-1.21 1.638-1.587 2.166-.497l.605 1.249l1.338-.352zm.026-1.6L6.16 5.284l1.043-.275c.296-.077.57-.25.803-.489L5.942 3.104a.596.596 0 0 0-.807.857zm4.002.74c-.38.575-.947 1.083-1.68 1.276l-3.83 1.008a.5.5 0 0 1-.577-.266l-.784-1.619c-.022-.046-.047-.062-.064-.07a.151.151 0 0 0-.093-.005a.152.152 0 0 0-.081.045C2.015 5.084 2 5.11 2 5.16V8a.75.75 0 0 0 .953.722l3.106-.875a1 1 0 0 1 1.248 1.18l-.313 1.407c-.12.535.586.844.899.393l3.196-4.61a.5.5 0 0 1 .239-.185l2.38-.873a.441.441 0 0 0 .27-.255a.303.303 0 0 0-.043-.294C13.373 3.831 12.52 3.007 11.497 3c-.483-.003-.934.207-1.348.543c-.415.336-.759.774-1.012 1.158zM1.5 14a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1h-13z"
        fill="currentColor"></path>
    </g>
</svg>
  `;
    res.send(svgIcon);
});

// app.listen(3000, () => console.log("Listening on port", 3000));

module.exports = app;
