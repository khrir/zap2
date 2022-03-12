require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const session = require("express-session");
const routes = require("./routes/routes");
const connectBD = require("./database/banco");

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

// Socket io - chat
const server = require('http').createServer(app);
const io = require('socket.io')(server);
let usuarios = [];
let ultimas_mensagens = []; 

server.listen(port, () => {
    console.log(`Server rodando: http://127.0.0.1:${port}`);
});

io.on("connection", function(socket){

    socket.on("sendNotification", function(details){
        socket.broadcast.emit("sendNotification", details)
    });

	socket.on("entrar", function(apelido, callback){
		if(!(apelido in usuarios)){
			socket.apelido = apelido;
			usuarios[apelido] = socket; 

			for(indice in ultimas_mensagens){
				socket.emit("atualizar mensagens", ultimas_mensagens[indice]);
			}

			let mensagem = "[ " + pegarDataAtual() + " ] " + apelido + " acabou de entrar na sala";
			let obj_mensagem = {msg: mensagem, tipo: 'sistema'};

			io.sockets.emit("atualizar usuarios", Object.keys(usuarios)); 
			io.sockets.emit("atualizar mensagens", obj_mensagem); 

			armazenaMensagem(obj_mensagem);

			callback(true);
		}else{
			callback(false);
		}
	});


	socket.on("enviar mensagem", function(dados, callback){

		let mensagem_enviada = dados.msg;
		let usuario = dados.usu;
		if(usuario == null)
			usuario = '';

		mensagem_enviada = "[ " + pegarDataAtual() + " ] " + socket.apelido + " diz: " + mensagem_enviada;
		let obj_mensagem = {msg: mensagem_enviada, tipo: ''};

		if(usuario == ''){
			io.sockets.emit("atualizar mensagens", obj_mensagem);
			armazenaMensagem(obj_mensagem);
		}else{
			obj_mensagem.tipo = 'privada';
			socket.emit("atualizar mensagens", obj_mensagem); 
			usuarios[usuario].emit("atualizar mensagens", obj_mensagem);
		}
		
		callback();
	});

	socket.on("disconnect", function(){
		delete usuarios[socket.apelido];
		let mensagem = "[ " + pegarDataAtual() + " ] " + socket.apelido + " saiu da sala";
		let obj_mensagem = {msg: mensagem, tipo: 'sistema'};
	
		io.sockets.emit("atualizar usuarios", Object.keys(usuarios));
		io.sockets.emit("atualizar mensagens", obj_mensagem);

		armazenaMensagem(obj_mensagem);
	});
});

function pegarDataAtual(){
	let dataAtual = new Date();
	let dia = (dataAtual.getDate()<10 ? '0' : '') + dataAtual.getDate();
	let mes = ((dataAtual.getMonth() + 1)<10 ? '0' : '') + (dataAtual.getMonth() + 1);
	let ano = dataAtual.getFullYear();
	let hora = (dataAtual.getHours()<10 ? '0' : '') + dataAtual.getHours();
	let minuto = (dataAtual.getMinutes()<10 ? '0' : '') + dataAtual.getMinutes();
	let segundo = (dataAtual.getSeconds()<10 ? '0' : '') + dataAtual.getSeconds();
	let dataFormatada = dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto + ":" + segundo;
	return dataFormatada;
}

function armazenaMensagem(mensagem){
	if(ultimas_mensagens.length > 5){
		ultimas_mensagens.shift();
	}
	ultimas_mensagens.push(mensagem);
}