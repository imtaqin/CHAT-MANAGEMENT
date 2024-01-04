const emailHandler = require('./EmailHandler');
const facebookHandler = require('./FacebookHandler');
const instagramHandler = require('./InstagramHandler');
const telegramHandler = require('./TelegramHandler');
const tiktokHandler = require('./TiktokHandler');

async function HandlerInit() {
    await emailHandler.emailInit();
    await facebookHandler.facebookInit();
    await instagramHandler.instagramInit();
    await telegramHandler.TelegramInit();
    await tiktokHandler.tiktokInit();
}

module.exports = {
    HandlerInit
}