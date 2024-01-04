const Instagram = require("./Instagram");
const Tiktok = require("./Tiktok");
const Telegram = require("./Telegram");
const Facebook = require("./Facebook");
const Email = require("./Email");
const DB = require("../config/Database");
const Webhook = require("./Webhook");
async function init() {
    await DB.sync();
}

module.exports = {
    init,
    Instagram,
    Tiktok,
    Telegram,
    Facebook,
    Email,
    Webhook
}