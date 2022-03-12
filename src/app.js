require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const session = require("express-session");
const routes = require("./routes/routes");
const connectBD = require("./database/banco")

connectBD();

const path = require('path');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded ({ extended: false}));

app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, '/views'));
app.use(express.json())
app.use(routes);
app.use(
    session({
      secret: process.env.APP_SECRET || "123",
      resave: true,
      saveUninitialized: true,
      cookie: { maxAge: 3000 },
    })
  );

app.listen(port, () => {
    console.log(`Server rodando: http://127.0.0.1:${port}`);
});


// Socket io - chat

