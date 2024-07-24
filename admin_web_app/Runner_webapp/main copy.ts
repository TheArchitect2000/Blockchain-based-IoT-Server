/* import express, { Express, Request, Response } from 'express';
// import { Express, Request, Response } from 'express';
// import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
// const app = express();
// const app: express.Application = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});


var message:string = "Hello World!" ;
console.log(message); */


import { Request, Response, Application } from 'express';
import express = require('express');
import * as dotenv from 'dotenv';


/* import * as https from 'https'; //*
import * as fs from 'fs';       //*
var key = fs.readFileSync(__dirname + '/assets/certificates/webprivate.key');          //*
var cert = fs.readFileSync(__dirname + '/assets/certificates/certs/webpublic.crt');   //*
var options = {     //*
  key: key,
  cert: cert
}; */

dotenv.config();
const port = process.env.PORT;

var app: Application = express();

/* app.get('/', function (req: Request, res: Response) {
  res.send('Blocklychain web app')
}); */

app.get('/welcome', function (req: Request, res: Response) {
  res.send('<h1>Welcome to Blocklychain.</h1>')
});

app.use(express.static('frontend'));

// app.listen(4000);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});