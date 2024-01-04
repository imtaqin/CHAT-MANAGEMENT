
const { Email, Webhook } = require("../model/Index");
const axios = require("axios");
const EmailClient = require("../modules/email/gmail");

async function fetchEmails() {
  const data = await Email.findAll();
  return data;
}

async function emailInit() {
  try {
    
  const data = await fetchEmails();
  if(data.length == 0){
    return;
}
  data.forEach((item) => {
    const client = new EmailClient(item.username, item.password);
    client.connect();

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
              // console.error(error);
            });
        });
      });
    });
  });
} catch (error) {
    
}
}

module.exports = {
  emailInit,
};
