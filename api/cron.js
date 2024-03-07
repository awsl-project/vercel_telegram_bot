const { Telegraf } = require('telegraf')
// const dotenv = require('dotenv')
// dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)

module.exports = async (req, res) => {
    const response = await fetch(`${process.env.API_URL}/moyu`);
    const msg = await response.text();
    for (const chatId of process.env.CRON_CHAT_IDS.split(',')) {
        await bot.telegram.sendMessage(chatId, msg);
    }
    res.status(200).end('cron done.');
};
