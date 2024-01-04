const EventEmitter = require('events');
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events/index.js');

class TelegramClientClass extends EventEmitter {
    constructor(stringSession) {
        super();
        this.apiId = 9840636;
        this.apiHash = "a553351096c7e6541f4261c17f80742f";
        this.stringSession = new StringSession(stringSession);
        this.client = new TelegramClient(this.stringSession, this.apiId, this.apiHash, {
            connectionRetries: 5,
        });
        this.client.on("connected", () => {
            console.log(`Logged in as ${this.client.session.save()}`);
        });

        this.client.addEventHandler(this.onMessage.bind(this), new NewMessage({}));
    }

    onMessage(event) {
        if (event.message.peerId.className !== 'PeerUser') return;
        const data = event.message;
        let sendData = {
            id: data.id,
            fromId: data.fromId,
            message: data.message,
            date: data.date,
            out: data.out,
            mediaUnread: data.mediaUnread,
            mentioned: data.mentioned,
            peerId: data.peerId,
        }
        this.emit('message', sendData);
    }

    async login() {
        await this.client.start({
            phoneNumber: async () => await input.text("Please enter your number: "),
            password: async () => await input.text("Please enter your password: "),
            phoneCode: async () => await input.text("Please enter the code you received: "),
            onError: (err) => console.log(err),
        });
    }
}

module.exports = TelegramClientClass;
