const express = require("express");
const DriverInfoRouter = express.Router();
const {requireAuth} = require("../../../middleware/jwtAuth");
const DriversService = require("../../../services/DriversService/DriversService");

DriverInfoRouter
    .route("/driver-info")
    .all(requireAuth)
    .get((req, res)=>{
        const driver = Object.assign({}, req.user);

        return res.status(200).json({
            driver
        });
    })
    .patch((req, res)=>{
        const {
            first_name,
            last_name,
            mobile_number,
            email,
            last_known_lat,
            last_known_lng,
            last_zip_code,
            active,
            active_start_time,
            paused,
            last_paused_time,
            signed_off_time
        } = req.body;

        const driver = {
            id: req.user.id,
            first_name,
            last_name,
            mobile_number,
            email,
            last_known_lat,
            last_known_lng,
            last_zip_code,
            active,
            active_start_time,
            paused,
            last_paused_time,
            signed_off_time
        };

        for(const [key, vlaue] of Object.entries(driver)){
            if(value === undefined){
                return res.status(400).json({
                    error: `Missing ${key} in body request`
                });
            };
        };

        DriversService.getDriverById(req.app.get("db"), driver.id)
            .then( dbDriver => {
                if(!dbDriver){
                    return res.status(404).json({
                        error: "Driver not found"
                    });
                };

                DriversService.updateDriver(req.app.get("db"), driver, driver.id)
                    .then( updatedDriver => {
                        return res.status(200).json({
                            updatedDriver
                        });
                    });
            });
    })
    .delete((req, res)=>{

    });

module.exports = DriverInfoRouter;