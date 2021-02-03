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
            email,
            password
        } = req.body;

        const driver = {
            email,
            password
        };

        for(const [key, value] of Object.entries(driver)){
            if(!value){
                return res.status(400).json({
                    error: `Missing ${key}`
                });
            };
        };

        DriversServices.getDriverByEmail(database, driver.email)
            .then( dbDriver => {
                if(!dbDriver){
                    return res.status(404).json({
                        error: `Driver with email ${driver.email} does not exist`
                    });
                };

                Bcrypt.comparePassword(driver.password, dbDriver.password)
                    .then( passwordMatch => {
                        if(!passwordMatch){
                            return res.status(400).json({
                                error: "Incorrect email or password"
                            });
                        };

                        const subject = dbDriver.email;
                        const payload = {
                            user: dbDriver.email,
                            type: "Driver"
                        };

                        delete dbDriver.password;

                        return res.status(200).json({
                            token: JWT.createJwt(subject, payload),
                            driver: dbDriver,
                            success: "Succefully logged in driver"
                        });
                    });
            });
    });

module.exports = DriverLoginRouter;