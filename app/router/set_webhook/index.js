const {Webhook} = require("../../model/Index");


module.exports = function (app) {
    app.post("/set_webhook", async (req, res) => {
        const {url} = req.body;
        // if url aready exist, update it
        if(await Webhook.findOne({where: {url}})) {
            await Webhook.update({url}, {where: {url}});
            return res.send("OK");
        }else {
        const result = await Webhook.create({
            url
        });

        res.send(result);
        }
    });
  };