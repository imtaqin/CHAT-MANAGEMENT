const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const express = require('express');
const session = require('express-session');

const apiId = 9840636;
const apiHash = "a553351096c7e6541f4261c17f80742f";
const stringSession = new StringSession("1BQANOTEuMTA4LjU2LjE0NwG7REUYQMYg4VKKZ+vesFcbPQoeAV5zu9nnglEzg+vvwDtSVqOtsFSNiagXpjdRdxDyhUfwqs29CiAyJSqeM4vtCSQG431tiHvJuebIM3cEAAqJnfI3cCsKe/zB+NN3xX138Ubes2N1o6AsePhSa2FyMydPdHs8/+Gvqf7NugAts3dGOPN0lcgAbnIg1WF6qOslJg9+wJpRA/QsA3KYnxBQJ3gWr9ReyaxUGNF96fwuS4JpFAWiV+qYR57ZokfvOe9yb0vR35J8uJIBy3Zdf6Gad7jO5ijycscD/9X3/3RnJeIVMgjnH2WdUdCG4mSfSeJJWzQsi9jqdmb3TCZmcVCmsw==");

const app = express();
app.use(express.json());
const clients = {}; // To hold all TelegramClients

app.post('/start', async (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    clients[phoneNumber] = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    const client = clients[phoneNumber];
    await client.connect(); // Connecting to the server
    await client.sendCode({apiId: apiId, apiHash: apiHash}, phoneNumber);
    res.send({ status: 'OK' });
});

app.post('/verify', async (req, res) => {
    const code = req.body.code;
    const phoneNumber = req.body.phoneNumber;
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
    res.send(sessionString);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
