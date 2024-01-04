const EventEmitter = require('events');
const Imap = require('node-imap');
const {simpleParser} = require('mailparser');
const nodemailer = require('nodemailer');
class EmailClient extends EventEmitter {
    constructor(host, port, user, password) {
        super();
        this.user = user;
        this.password = password;
        this.host = host;
        this.port = port;
        this.tls = true;
        this.client = new Imap({
            user: this.user,
            password: this.password,
            host: this.host,
            port: this.port,
            tls: this.tls
        });

        this.client.once('ready', () => {
            console.log('Connected to IMAP server');
            this.client.openBox('INBOX', true, (err, box) => {
                if (err) throw err;

                console.log(`Total messages in INBOX: ${box.messages.total}`);

                this.client.on('mail', (numNewMsgs) => {
                    console.log(`New email received: ${numNewMsgs} new messages`);
                    const f = this.client.seq.fetch(box.messages.total, { bodies: [''] });

                    f.on('message', (msg, seqno) => {
                        msg.on('body', (stream, info) => {
                            let buffer = '';
                            stream.on('data', (chunk) => {
                                buffer += chunk.toString('utf8');
                            });
                            stream.once('end', () => {
                                simpleParser(buffer, (err, email) => {
                                    if(err) throw err;
                                  //  console.log(email);
                                    const data = {
                                        from: email.from.text,
                                        to: email.to.text,
                                        subject: email.subject,
                                        text: email.text.split('>')[0]

                                    }
                                    this.emit('message', data);
                                });
                            });
                        });
                    });
                });
            });
        });

        this.client.once('error', (err) => {
            console.error(err);
        });

        this.client.once('end', () => {
            console.log('Connection ended');
        });

        
    }

    connect() {
        this.client.connect();
    }

    sendMail(to, subject, text) {
        const transporter = nodemailer.createTransport({
            host: this.host,
            port: this.port,
            secure: this.tls,
            auth: {
                user: this.user,
                pass: this.password
            }
        });

        const mailOptions = {
            from: this.user,
            to: to,
            subject: subject,
            text: text
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if(err) throw err;
           return info;
        });
    }
}

module.exports = EmailClient;
