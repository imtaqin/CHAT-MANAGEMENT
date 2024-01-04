const { emailInit } = require("./app/handler/EmailHandler");
const { facebookInit } = require("./app/handler/FacebookHandler");
const { instagramInit } = require("./app/handler/InstagramHandler");
const { TelegramInit } = require("./app/handler/TelegramHandler");
const TelegramClientClass = require("./app/modules/SocialMedia/telegram/TelegramClient");


// async function main() {
//     const telegramClient = new TelegramClientClass();
//     const code = await telegramClient.login("+6285218085898","35238");
//     console.log(code);
//   }
  
  // main().catch(console.error);
  TelegramInit();