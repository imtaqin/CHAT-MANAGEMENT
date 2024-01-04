const { Tiktok } = require("../../model/Index");
const TikTokClient = require("../../modules/SocialMedia/tiktok/Tiktok");

module.exports = function (app) {
  app.post("/tiktok", async (req, res) => {
    const { username, password } = req.body;

    const tikTokClient = new TikTokClient(username, password);
    const cookie = await tikTokClient.startApp();
    console.log(cookie);

    // Check if a Tiktok entry already exists for this username
    const existingEntry = await Tiktok.findOne({ where: { username } });

    if (existingEntry) {
      // Update the existing entry with the new cookie
      existingEntry.cookie = JSON.stringify(cookie);
      await existingEntry.save();
    } else {
      // Create a new entry with the provided username, password, and cookie
      await Tiktok.create({
        username,
        password,
        cookie: JSON.stringify(cookie),
      });
    }

    res.sendStatus(200);
  });
};