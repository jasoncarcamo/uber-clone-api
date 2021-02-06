const express = require("express");
const TripsRouter = express.Router();
const {requireAuth} = require("../../../middleware/jwtAuth");
const TripServices = require("../../../services/TripServices/TripServices");

TripsRouter
    .route("/trips")
    .all(requireAuth)
    .post((req, res)=>{
        const {
            pick_up_address,
            drop_off_address,
            zip_code,
            pick_up_lat,
            pick_up_lng,
            drop_off_lat,
            drop_off_lng,
            distance,
            duration,
            price,
            scheduled,
            scheduled_date_time,
            time_requested,
            date_created
        } = req.body;

        const newTrip = {
            pick_up_address,
            drop_off_address,
            zip_code,
            pick_up_lat,
            pick_up_lng,
            drop_off_lat,
            drop_off_lng,
            distance,
            duration,
            price,
            scheduled,
            scheduled_date_time,
            time_requested,
            passenger_id: req.user.id,
            date_created
        };
        const dataBase = req.app.get("db");

        for(const [key, value] of Object.entries(newTrip)){
            if(value === undefined){
                return res.status(400).json({
                    error: `Missing ${key}`
                });
            };
        };

        TripServices.createTrip(dataBase, newTrip)
            .then( createdTrip => {
                
                return res.status(200).json({
                    createdTrip
                });
            });
    });

module.exports = TripsRouter;