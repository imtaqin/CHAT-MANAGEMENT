const {Telegram,Webhook} = require("../model/Index");
const TelegramClientClass = require("../modules/SocialMedia/telegram/TelegramClient");
const axios = require("axios");
async function fethSession() {
    const data = await Telegram.findAll();
    return data;
  }
  
  async function TelegramInit() {
    try {
        
   
    const data = await fethSession();
    if(data.length == 0){
        return;
    }
    data.forEach((item) => {
      const client = new TelegramClientClass(item.stringSession);
        client.login();
  
      client.on("message", (message) => {
     console.log(message)
     const webhookUrl = async () => {
        const data = await Webhook.findAll();
        return data;
      };
      webhookUrl().then((data) => {
        data.forEach((item) => {
          axios
            .post(item.url, message)
            .then((res) => {

            })
            .catch((error) => {
            //  console.error(error);
            });
        });
      });

      });
    });
} catch (error) {
        
}
  }
  
  module.exports = {
    TelegramInit,
  };
  