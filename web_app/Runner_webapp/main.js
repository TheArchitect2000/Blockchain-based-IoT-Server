const express = require("express");
require("dotenv").config();

const https = require("https");
const fs = require("fs");
const rateLimit = require("express-rate-limit");

var key = fs.readFileSync("/etc/nginx/ssl/privkey.pem");
var cert = fs.readFileSync("/etc/nginx/ssl/fullchain.pem");
var options = {
  key: key,
  cert: cert,
};

const port = process.env.PORT;

const app = express();

const indexLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(express.static(__dirname + "/frontend"));
app.use("/", indexLimiter, (req, res) => {
  res.sendFile(__dirname + "/frontend/index.html");
});

const httpsServer = https.createServer(options, app);

httpsServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
