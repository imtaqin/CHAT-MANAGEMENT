const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events/index.js');
const bodyParser = require('body-parser');
const input = require('input');

const apiId = 9840636;
const apiHash = "a553351096c7e6541f4261c17f80742f";
const stringSession = new StringSession(""); // fill this later with the value from session.save()

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  async function eventPrint(event) {
    const message = event.message;
    const peerId = event.message.peerId;

    console.log(message);
    await client.sendMessage('me', { message: JSON.stringify(peerId) });

    if (peerId.className == 'PeerChannel' && peerId.channelId == 11111111) {
      await client.forwardMessages('-xxxxxxxx', { messages: message }); // change it
    }
  }
  console.log("You should now be connected.");
  console.log(client.session.save()); // Save this string to avoid logging in again
  await client.sendMessage("me", { message: "Hello!" });
  client.addEventHandler(eventPrint, new NewMessage({}));
})();

