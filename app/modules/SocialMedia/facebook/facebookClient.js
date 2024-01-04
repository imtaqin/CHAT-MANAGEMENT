const EventEmitter = require('events');
const login = require("../../../lib/FB_API");
const fs = require("fs");


class FacebookClient extends EventEmitter {
    constructor(cookie) {
        super();
        this.cookie = cookie;
        this.client = null;
    }

    login() {
        return new Promise((resolve, reject) => {
            login({appState: JSON.parse(this.cookie)}, (err, api) => {
                if(err) return reject(err);

                this.client = api;
                this.client.setOptions({listenEvents: true});

                var stopListening = this.client.listenMqtt((err, event) => {
                    if(err) return console.error(err);
                    
                    this.client.markAsRead(event.threadID, (err) => {
                        if(err) console.error(err);
                    });
                    // send message when event on "send_message"
                    this.on("send_message", (data) => {
                        this.client.sendMessage(data.message, data.threadID);
                    });
                    switch(event.type) {
                        case "message":
                            if(event.body === '/stop') {
                                this.client.sendMessage("Goodbye…", event.threadID);
                                return stopListening();
                            }

                            // Emit the received message
                            this.emit('message', event.body);
                            break;
                        case "event":
                            // Emit the received event
                            this.emit('event', event);
                            break;
                    }
                });
                resolve(api);
            });
        });
    }
}

module.exports = FacebookClient;
