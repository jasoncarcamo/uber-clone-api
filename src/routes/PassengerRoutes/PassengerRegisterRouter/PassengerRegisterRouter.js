const express = require("express");
const PassengerRegisterRouter = express.Router();
const Bcrypt = require("../../../services/Bcrypt/Bcrypt");
const JWT = require("../../../services/JWT/JWT");
const PassengersService = require("../../../services/PassengersService/PassengersService");

PassengerRegisterRouter
    .route("/register-passenger")
    .post((req, res)=>{
        const database = req.app.get("db");
        const {
            first_name,
            last_name,
            mobile_number,
            email,
            password,
            home_address,
            work_address,
            trip_redemption,
            date_created,
            member
        } = req.body;

        const newPassenger = {
            first_name,
            last_name,
            mobile_number,
            email,
            password,
            home_address,
            work_address,
            trip_redemption,
            date_created,
            member
        };

        for(const [key, value] of Object.entries(newPassenger)){
            // value can equal 
            if(value === undefined){
                return res.status(400).json({
                    error: `Missing ${key}`
                });
            };
        };

        PassengersService.getPassengerByEmail(database, newPassenger.email)
            .then( dbPassenger => {
                if(dbPassenger){
                    return res.status(400).json({
                        error: `${dbPassenger.email} is already registered as a passenger`
                    });
                };

                Bcrypt.hashPassword(newPassenger.password)
                    .then( hashedPassword => {

                        newPassenger.password = hashedPassword;

                        PassengersService.createPassenger(database, newPassenger)
                            .then( createdPassenger => {
                                const subject = createdPassenger.email;
                                const payload = {
                                    user: createdPassenger.email,
                                    type: "Passenger"
                                };

                                delete createdPassenger.password;

                                return res.status(200).json({
                                    token: JWT.createJwt(subject, payload),
                                    createdPassenger
                                });
                            });
                    });
            });
    });

module.exports = PassengerRegisterRouter;