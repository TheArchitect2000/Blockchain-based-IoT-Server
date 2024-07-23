const express = require("express");
require("dotenv").config();

const https = require("https");
const fs = require("fs");

var key = fs.readFileSync(__dirname + "/assets/certificates/webprivate.pem"); //*
var cert = fs.readFileSync(__dirname + "/assets/certificates/webpublic.pem"); //*
var options = {
  key: key,
  cert: cert,
};

const port = process.env.PORT;

const app = express();

app.use(express.static(__dirname + "/frontend"));
app.use("/*", (req, res) => {
  res.sendFile(__dirname + "/frontend/index.html");
});

const httpsServer = https.createServer(options, app);


httpsServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});


