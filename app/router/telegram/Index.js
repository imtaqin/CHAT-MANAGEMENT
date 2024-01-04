const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const Telegram = require('../../model/Telegram');
const apiId = 9840636;
const apiHash = "a553351096c7e6541f4261c17f80742f";
const stringSession = new StringSession();

module.exports = function (app) {
    const clients = {}; // To hold all TelegramClients

    app.post('/telegram_login', async (req, res) => {
        const phoneNumber = req.body.nohp;
        clients[phoneNumber] = new TelegramClient(stringSession, apiId, apiHash, {
            connectionRetries: 5,
        });
    
        const client = clients[phoneNumber];
        await client.connect(); // Connecting to the server
        await client.sendCode({apiId: apiId, apiHash: apiHash}, phoneNumber);
        res.send({ status: 'OK' });
    });
    
    app.post('/telegram_verify', async (req, res) => {
        const code = req.body.code;
        const phoneNumber = req.body.nohp;
        const client = clients[phoneNumber];
    
        if(!client) {
            res.send({ status: 'ERROR', message: 'Start not called or phoneNumber not recognized.' });
            return;
        }
        
        await client.start({
            phoneNumber: phoneNumber,
            phoneCode: async () => code,
            onError: (err) => console.log(err),
        });
    
        const sessionString = client.session.save(); // Save the string session
        const result = await Telegram.create({
            stringSession: sessionString,
        });

        res.send(result);
    });
  };