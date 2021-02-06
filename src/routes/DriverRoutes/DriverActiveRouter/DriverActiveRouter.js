const express = require("express");
const DriverActiveRouter = express.Router();
const {requireAuth} = require("../../../middleware/jwtAuth");
const DriversService = require("../../../services/DriversService/DriversService");

DriverActiveRouter
    .route("/driver/active")
    .all(requireAuth)
    .get((req, res)=>{

    })
    .patch((req, res)=>{
        const database = req.app.get("db");
        const {
            active,
            paused
        } = req.body;

        const newDriverActive = {
            active,
            paused
        };

        for(const [key, value] of Object.entries(newDriverActive)){
            if(value === undefined){
                return res.status(400).json({
                    error: `Missing ${key}`
                });
            };
        };

        DriversService.updateDriver(database, newDriverActive, req.user.id)
            .then( updatedDriver => {
                return res.status(200).json({
                    updatedDriver
                });
            });
    })

module.exports = DriverActiveRouter;