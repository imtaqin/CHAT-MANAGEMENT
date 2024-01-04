const express = require("express");
const app = express();
var fs = require("fs");
var path = require("path");
const { init } = require("./app/model/Index");
const config = require("./config");
const { HandlerInit } = require("./app/handler");
const port = config.PORT_APPS;

app.use(express.json());

function includeRouter(folderName) {
  console.log(" ======================================= ")
  fs.readdirSync(folderName).forEach(function (file) {
    var fullName = path.join(folderName, file);
    var stat = fs.lstatSync(fullName);

    if (stat.isDirectory()) {
      includeRouter(fullName);
    } else if (file.toLowerCase().indexOf(".js")) {
      require("./" + fullName)(app);
      console.log(" Found Router => '" + fullName + "'");
    }
  });
  console.log(" ======================================= ")
}

includeRouter("app/router/");


app.listen(port, async () => {
  await init();
  await HandlerInit( );
  console.log(`
  Web server listening at http://localhost:${port} 
  `);
});