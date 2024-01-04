const EventEmitter = require('events');
const {Instagram} = require("../../../model/Index");
const Insta = require('../../../lib/node-ig-framework/src');


class InstagramClient extends EventEmitter {
    constructor(username, password) {
        super();
        this.username = username;
        this.password = password;
        this.client = new Insta.Client();

        this.client.on("connected", () => {
            console.log(`Logged in as ${this.client.user.username}`);
        });

        this.client.on("messageCreate", (message) => {
            if (message.author.id === this.client.user.id) return;

            message.markSeen();

            if (message.content === "!ping") {
                message.reply("!pong");
            }

            message.chat.startTyping({ time: 5000 });

            // Emit the received message
            this.emit('message', message);
        });
    }

    async login() {
        return  this.client.login(this.username, this.password);
    }
}

module.exports = InstagramClient;