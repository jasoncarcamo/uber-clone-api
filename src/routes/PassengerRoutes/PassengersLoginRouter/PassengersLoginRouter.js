const express = require("express");
const PassengersLoginRouter = express.Router();
const PassengersService = require("../../../services/PassengersService/PassengersService");
const Bcrypt = require("../../../services/Bcrypt/Bcrypt");
const JWT = require("../../../services/JWT/JWT");

PassengersLoginRouter
    .route("/login-passenger")
    .post((req, res)=>{
        const database = req.app.get("db");
        const {
            email,
            password
        } = req.body;

        const passenger = {
            email,
            password
        };

        for(const [key, value] of Object.entries(passenger)){
            if(!value){
                return res.status(400).json({
                    error: `Missing ${key}`
                });
            };
        };

        PassengersService.getPassengerByEmail(database, passenger.email)
            .then( dbPassenger => {
                if(!dbPassenger){
                    return res.status(404).json({
                        error: `${passenger.email} is not registered as a passenger`
                    });
                };

                Bcrypt.comparePassword(passenger.password, dbPassenger.password)
                    .then( passwordMatches => {
                        if(!passwordMatches){
                            return res.status(400).json({
                                error: "Incorrect password"
                            });
                        };

                        const subject = dbPassenger.email;
                        const payload = {
                            user: dbPassenger.email,
                            type: "Passenger"
                        };
                        
                        delete dbPassenger.password;

                        return res.status(200).json({
                            token: JWT.createJwt(subject, payload),
                            success: "Succefully logged in passenger",
                            dbPassenger
                        });
                    });
            });
    });

module.exports = PassengersLoginRouter;