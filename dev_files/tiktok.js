const TikTokClient = require("./app/modules/SocialMedia/tiktok/Tiktok");

const client = new TikTokClient("cumafollowersgadakonten","calang123123@");

// Handle 'message' events
client.on('message', (message) => {
console.log(message);
});

// Start the application
client.startApp()
    .then(() => console.log('TikTok client started successfully'))
    .catch((error) => console.error('Failed to start TikTok client:', error));