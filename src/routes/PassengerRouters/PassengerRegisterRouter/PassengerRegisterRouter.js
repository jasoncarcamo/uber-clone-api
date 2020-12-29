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
            date_created
        } = req.body;

        const newPassenger = {
            first_name,
            last_name,
            mobile_number,
            email,
            password,
            date_created: date_created || new Date()
        };

        for(const [key, value] of Object.entries(newPassenger)){
            if(!value){
                return res.status(400).json({
                    error: `Missing ${key}`
                });
            };
        };

        PassengersService.getPassengerByMobileNumber(database, newPassenger.mobile_number)
            .then( dbPassenger => {
                if(dbPassenger){
                    return res.status(400).json({
                        error: `${dbPassenger.mobile_number} is already registered as a passenger`
                    });
                };

                Bcrypt.hashPassword(newPassenger.password)
                    .then( hashedPassword => {

                        newPassenger.password = hashedPassword;

                        PassengersService.createPassenger(database, newPassenger)
                            .then( createdPassenger => {
                                const subject = createdPassenger.mobile_number;
                                const payload = {
                                    user: createdPassenger.mobile_number,
                                    type: "Passenger"
                                };

                                return res.status(200).json({
                                    token: JWT.createJwt(subject, payload)
                                });
                            });
                    });
            });
    });

module.exports = PassengerRegisterRouter;