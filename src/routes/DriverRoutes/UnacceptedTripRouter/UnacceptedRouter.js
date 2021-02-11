const express = require("express");
const UnacceptedTripRouter = express.Router();
const {requireAuth} = require("../../../middleware/jwtAuth");
const DriverTripsService = require("../../../services/DriversTripService/DriversTripService");

UnacceptedTripRouter
    .route("/trip/unaccepted")
    .all(requireAuth)
    .get((req, res)=>{
        const id = req.user.id;
        const dataBase = req.app.get("db");

        DriverTripsService.getDriverUnacceptedTrip(dataBase, id)
            .then( unacceptedTrip => {
                if(!unacceptedTrip){
                    return res.status(404).json({
                        error: "Unaccepted trip not found"
                    });
                };
                
                return res.status(200).json({
                    unacceptedTrip
                });
            });
    })

module.exports = UnacceptedTripRouter;