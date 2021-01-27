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

        DriversService.getDriverByMobileNumber(req.app.get("db"), newDriver.mobile_number)
            .then( dbDriver => {
                if(dbDriver){
                    return res.status(400).json({
                        error: `${dbDriver.mobile_number} is already registered as a driver`
                    });
                };

                Bcrypt.hashPassword(newDriver.password)
                    .then( hashedPassword => {

                        newDriver.password = hashedPassword;

                        DriversService.createDriver(req.app.get("db"), newDriver)
                            .then( createdDriver => {
                                const subject = createdDriver.mobile_number;
                                const payload = {
                                    user: createdDriver.mobile_number,
                                    type: "Driver"
                                };

                                return res.status(200).json({
                                    token: JWT.createJwt(subject, payload)
                                });
                            });
                    });
            });
    });

module.exports = DriverRegisterRouter;