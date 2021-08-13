const express = require("express");
const CurrentTripsRouter = express.Router();
const {requireAuth} = require("../../../middleware/jwtAuth");
const DriversTripService = require("../../../services/DriversTripService/DriversTripService");

CurrentTripsRouter
    .route("/driver/current-trips")
    .all(requireAuth)
    .get((req, res)=>{
        const database = req.app.get("db");
        console.log("Deasring")
        DriversTripService.getDriverActiveTrips(database, req.user.id)
            .then( trip => {

                if(!trip){
                    return res.status(404).json({
                        error: "Active trip not found"
                    })
                }
                return res.status(200).json({
                    trip
                });
            });
    })

CurrentTripsRouter
    .route("/driver/current-trip/:driver_id")
    .all(requireAuth)
    .get((req, res)=>{
        const database = req.app.get("db");
        const id = req.user.id;

        DriversTripService.getDriverActiveTrips(database, id)
            .then( driverTrips => {
                
                return res.status(200).json({
                    driverTrips
                });
            });
    })
    .patch((req, res)=>{

    })
    .delete((req, res)=>{

    })

module.exports = CurrentTripsRouter;