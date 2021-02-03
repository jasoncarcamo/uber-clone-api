const PassengersService = require("../services/PassengersService/PassengersService");
const DriversService = require("../services/DriversService/DriversService");
const JWT = require("../services/JWT/JWT");
let UserService;

function requireAuth( req, res, next){
    const authToken = req.get("authorization") || "";
    let bearerToken;

    if(!authToken.toLowerCase().startsWith("bearer ")){

        return res.status(401).json({ error: "Missing bearer token" });
    } else {
        bearerToken = authToken.slice( 7, authToken.length);
    };

    try{
        const payload = JWT.verifyToken(bearerToken);

        if(payload.type === "Driver"){
            UserService = DriversService;
        } else if(payload.type === "Passenger"){
            UserService = PassengersService;
        };
        
        UserService.getBySub( req.app.get("db"), payload.sub)
            .then( user => {
                if(!user){

                    return res.status(401).json({
                        error: "Unauthorized request"
                    });
                };

                delete user.password;

                req.user = user;

                req.type = payload.type;
                
                next();
            })
            .catch( err => {
                next(err)
            });

    } catch( error){
        return res.status(401).json({ error: "Unauthorized request"});
    };
};

module.exports = {
    requireAuth
};