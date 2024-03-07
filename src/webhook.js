const { Telegraf } = require('telegraf')
const dotenv = require('dotenv')
dotenv.config()

console.log(process.env.DOMAIN)

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.createWebhook({
    domain: process.env.DOMAIN,
    path: "/bot"
}).then(() => {
    console.log("Webhook created")
}).catch((err) => {
    console.log(err)
});
