const mongoose = require("mongoose");

function connectBD () {
    mongoose.Promise = global.Promise;

    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    bd = mongoose.connection;

    bd.on('connected', () => { console.log("BD conectado") });
    bd.on("error", err => { console.log("Não conectou ao BD: ", + err) });
    bd.on("disconnect", () => { console.log("BD desconectado") });
}

module.exports = connectBD;