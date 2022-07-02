const jwt = require('jsonwebtoken');
//for token generation
const generateToken = (id) => {
    return jwt.sign({id},process.env.JSON_SECRET,{
        expiresIn:"30d"
    });
}

module.exports = generateToken;