const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../models/modelBD');

module.exports = {
    async index (request, response){
        try{
            const users = await User.find();
            users.senha = undefined;
            return response.status(200).json({ users });

        }catch(err){
            return response.status(400).send({ error: "Registration failed"});
        }
    },

    async store (request, response) { 
        const {nome, email, senha} = request.body;

        if(!nome || !email || !senha) {
            return response.status(400).json({error: "Missing name, email or password", status: 400});
        }
        const user = new User({
            nome,
            email,
            senha,
        });

        try{
            if(await User.findOne({ email })){
                return response.status(400).json({error: "User already exists.", status: 400});
            }
            await user.save();
            return response.status(201).json({message: "Tá salvo, chefia.", status: 201});
        }catch (err){
            return response.status(400).json({error: err.message});
        }
    },

    async authenticate(request, response){
        const { email, senha} = request.body;
        const user  = await User.findOne({ email }).select("+senha");

        if(!user){
            return response.status(404).json({error: "User not found.", status: 404});
        }
        if(!await bcrypt.compare(senha, user.senha)){
            return response.status(400).json({error: "Invalid password.", status: 400})
        }
        user.senha = undefined;
        
        return response.status(200).json({message: "O pai tá on", status: 200});

    }
};