const TikTokClient = require("../modules/SocialMedia/tiktok/Tiktok");
const { Tiktok, Webhook } = require("../model/Index");
const axios = require("axios");

async function fetchTikTok() {
  const data = await Tiktok.findAll();
  return data;
}

async function tiktokInit() {
  try {
    const data = await fetchTikTok();

    if(data.length == 0){
      return;
    }

    data.forEach((item) => {
      const client = new TikTokClient(item.username, item.password);
      client.startApp();

      client.on("message", (message) => {
        let msgData = message;

        let toWebhook = {
          message: msgData.message,
          senderID: msgData.nickname, // assuming nickname is the sender's ID
          username: msgData.nickname,
          platform: "tiktok",
        };

        let userData = {
          uuid: item.uuid, // assuming Tiktok model has a uuid property
          username: item.username,
          webhookData: toWebhook,
        };

        const webhookUrl = async () => {
          const data = await Webhook.findAll();
          return data;
        };

        webhookUrl().then((data) => {
          data.forEach((item) => {
            axios
              .post(item.url, userData)
              .then((res) => {
                // Handle success
              })
              .catch((error) => {
                // Handle error
              });
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  tiktokInit,
};
