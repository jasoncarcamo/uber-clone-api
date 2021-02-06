const express = require("express");
const CurrentTripsRouter = express.Router();
const {requireAuth} = require("../../../middleware/jwtAuth");
const DriversTripService = require("../../../services/DriversTripService/DriversTripService");

CurrentTripsRouter
    .route("/driver/current-trips")
    .all(requireAuth)
    .get((req, res)=>{
        const database = req.app.get("db");

        DriversTripService.getDriverActiveTrips(database, req.user.id)
            .then( driverTrips => {
                
                return res.status(200).json({
                    driverTrips
                });
            });
    })
    
CurrentTripsRouter
    .route("/driver/current-trip/:tripId")
    .all(requireAuth)
    .get((req, res)=>{

    })
    .patch((req, res)=>{

    })
    .delete((req, res)=>{

    })

module.exports = CurrentTripsRouter;