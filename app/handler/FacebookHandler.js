const FacebookClient = require("../modules/SocialMedia/facebook/facebookClient");
const { Facebook, Webhook } = require("../model/Index");
const axios = require("axios");

async function fetchFacebook() {
  const data = await Facebook.findAll();
  return data;
}

async function facebookInit() {
  try {
  const data = await fetchFacebook();
  if(data.length == 0){
    return;
}
  data.forEach((item) => {
    const client = new FacebookClient(item.cookie);
    client.login().then(api => {
      client.on("message", (message) => {
        let toWebhook = {
          message: message.body,
          senderID: message.senderID,
          threadID: message.threadID,
          platform: "facebook",
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
              // console.error(error);
              });
          });
        });
      });
    }).catch(err => console.error(err));
  });
} catch (error) {
    
}
}

module.exports = {
  facebookInit,
};
