module.exports = function (app) {
    app.post("/webhook", async (req, res) => {
        const { body } = req;
        console.log(body);
        res.status(200).send("OK");
    });
  };