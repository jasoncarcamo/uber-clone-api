const express = require("express");
const DriverRegisterRouter = express.Router();
const DriversService = require("../../../services/DriversService/DriversService");
const Bcrypt = require("../../../services/Bcrypt/Bcrypt");
const JWT = require("../../../services/JWT/JWT");

DriverRegisterRouter
    .route("/register-driver")
    .post((req, res)=>{
        const {
            first_name,
            last_name,
            mobile_number,
            password,
            email,
            date_created
        } = req.body;

        const newDriver = {
            first_name,
            last_name,
            mobile_number,
            password,
            email,
            date_created: date_created || new Date()
        };

        for(const [key, value] of Object.entries(newDriver)){
            if(!value){
                return res.status(400).json({
                    error: `Missing ${key}`
                });
            };
        };

        DriversService.getDriverByEmail(req.app.get("db"), newDriver.email)
            .then( dbDriver => {
                if(dbDriver){
                    return res.status(400).json({
                        error: `${dbDriver.email} is already registered as a driver`
                    });
                };

                Bcrypt.hashPassword(newDriver.password)
                    .then( hashedPassword => {

                        newDriver.password = hashedPassword;

                        DriversService.createDriver(req.app.get("db"), newDriver)
                            .then( createdDriver => {
                                const subject = createdDriver.email;
                                const payload = {
                                    user: createdDriver.email,
                                    type: "Driver"
                                };

                                return res.status(200).json({
                                    token: JWT.createJwt(subject, payload),
                                    createdDriver
                                });
                            });
                    });
            });
    });

module.exports = DriverRegisterRouter;