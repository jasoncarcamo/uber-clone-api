const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../../../config");

const JWT = {
    createJwt(subject, payload){
        return jwt.sign(payload, JWT_SECRET, {
            subject,
            algorithm: "HS256"
        });
    },
    verifyToken(token){
        return jwt.verify(token, JWT_SECRET, {
            algorithms: ["HS256"]
        });
    }
};

module.exports = JWT;