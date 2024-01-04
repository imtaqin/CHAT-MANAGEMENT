const InstagramClient = require("../modules/SocialMedia/instagram/Insta");
const { Instagram, Webhook } = require("../model/Index");
const axios = require("axios");
async function fetchInstagram() {
  const data = await Instagram.findAll();
  return data;
}

async function instagramInit() {
  try {
    

  const data = await fetchInstagram();

  if(data.length == 0){
    return;
}
  data.forEach((item) => {
    const client = new InstagramClient(item.username, item.password);
    client.login();
    client.on("message", (message) => {
      let msgData = message.toJSON();

      let toWebhook = {
        message: msgData.content,
        senderID: msgData.authorID,
        username: msgData.username,
        platform: "instagram",
      };

      let userData = {
        uuid: item.uuid,
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
  instagramInit,
};
