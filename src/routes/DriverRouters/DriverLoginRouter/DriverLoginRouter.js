const express = require("express");
const DriverLoginRouter = express.Router();
const DriversServices = require("../../../services/DriversService/DriversService");
const Bcrypt = require("../../../services/Bcrypt/Bcrypt");
const JWT = require("../../../services/JWT/JWT");

DriverLoginRouter
    .route("/login-driver")
    .post((req, res)=>{
        const database = req.app.get("db");
        const {
            mobile_number,
            password
        } = req.body;

        const driver = {
            mobile_number,
            password
        };

        for(const [key, value] of Object.entries(driver)){
            if(!value){
                return res.status(400).json({
                    error: `Missing ${key}`
                });
            };
        };

        DriversServices.getDriverByMobileNumber(database, driver.mobile_number)
            .then( dbDriver => {
                if(!dbDriver){
                    return res.status(404).json({
                        error: `Driver with mobile number ${driver.mobile_number} does not exist`
                    });
                };

                Bcrypt.comparePassword(driver.password, dbDriver.password)
                    .then( passwordMatch => {
                        if(!passwordMatch){
                            return res.status(400).json({
                                error: "Incorrect password"
                            });
                        };

                        const subject = dbDriver.mobile_number;
                        const payload = {
                            user: dbDriver.mobile_number,
                            type: "Driver"
                        };

                        return res.status(200).json({
                            token: JWT.createJwt(subject, payload),
                            success: "Succefully logged in driver"
                        });
                    });
            });
    });

module.exports = DriverLoginRouter;