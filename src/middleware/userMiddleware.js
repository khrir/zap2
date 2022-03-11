const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = async (request, response, next) =>{
    const auth = request.headers.authorization;

    if(!auth){
        return response.status(401).json({error: "No token provided."});
    }
    
    const [, token] = auth.split(" ");

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
        
        if(!decoded){
            return response.status(401).json({error: "Perdeu o tempo, playboy."});
        }
        else{
            request.user_id = decoded.id;
        }
    } catch (error) {
        return response.status(401).json({error: error.message});
    }
}