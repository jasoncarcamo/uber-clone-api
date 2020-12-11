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
            mobile_number,
            password
        } = req.body;

        const passenger = {
            mobile_number,
            password
        };

        for(const [key, value] of Object.entries(passenger)){
            if(!value){
                return res.status(400).json({
                    error: `Missing ${key}`
                });
            };
        };

        PassengersService.getPassengerByMobileNumber(database, passenger.mobile_number)
            .then( dbPassenger => {
                if(!dbPassenger){
                    return res.status(404).json({
                        error: `${passenger.mobile_number} is not registered as a passenger`
                    });
                };

                Bcrypt.comparePassword(passenger.password, dbPassenger.password)
                    .then( passwordMatches => {
                        if(!passwordMatches){
                            return res.status(400).json({
                                error: "Incorrect password"
                            });
                        };

                        const subject = dbPassenger.mobile_number;
                        const payload = {
                            user: dbPassenger.mobile_number,
                            type: "Passenger"
                        };

                        return res.status(200).json({
                            token: JWT.createJwt(subject, payload),
                            success: "Succefully logged in passenger"
                        });
                    });
            });
    });

module.exports = PassengersLoginRouter;