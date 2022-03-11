const express = require("express");
const routes = express.Router();

const middleware = require("../middleware/userMiddleware");
const auth = require("../controllers/authController");

// render index file
routes.get('/', (req, res) => {
    return res.sendFile("/home/khrir/Documents/Repositorios/zap2/src/views/index.html");
});

// render register file
routes.get('/register', (req, res) => {
    return res.sendFile("/home/khrir/Documents/Repositorios/zap2/src/views/register.html");
});
routes.post('/register', auth.store);

// render login file
routes.get('/login', (req, res) => {
    return res.sendFile("/home/khrir/Documents/Repositorios/zap2/src/views/login.html");
});
routes.post('/login', auth.authenticate);


// brincadeira
routes.get("/chat", (req, res) => {
    return res.sendFile("/home/khrir/Documents/Repositorios/zap2/src/views/chat.html");
});


module.exports = routes;