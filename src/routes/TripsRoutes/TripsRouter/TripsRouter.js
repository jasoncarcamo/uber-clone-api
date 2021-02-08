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
            pick_up_zip_code,
            pick_up_lat,
            pick_up_lng,
            drop_off_lat,
            drop_off_lng,
            drop_off_zip_code,
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
            pick_up_zip_code,
            pick_up_lat,
            pick_up_lng,
            drop_off_lat,
            drop_off_lng,
            drop_off_zip_code,
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
    })

TripsRouter
    .route("/trip/:id")
    .all(requireAuth)
    .get((req, res)=>{
        const dataBase = req.app.get("db");

        TripServices.getTripById(dataBase, req.params.id)
            .then( trip => {
                if(!trip){
                    return res.status(404).json({
                        error: "Trip not not found"
                    });
                };

                return res.status(200).json({
                    trip
                });
            });
    })
    .patch((req, res)=>{
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

        const updateTrip = {
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
        const id = req.params.id;

        TripServices.getTripById(dataBase, id)
            .then( dbTrip => {
                if(!dbTrip){
                    return res.status(404).json({
                        error: `Trip not found`
                    });
                };

                TripServices.updateTrip(dataBase, updateTrip, updateTrip.id)
                    .then( updatedTrip => {
                        return res.status(200).json({
                            updatedTrip
                        });
                    });
            });
    })
    .delete((req, res)=>{
        const dataBase = req.app.get("db");
        const id = req.params.id;

        TripServices.getTripById(dataBase, id)
            .then( trip => {
                if(!trip){
                    return res.status(404).json({
                        error: "Trip not found"
                    });
                };

                TripServices.deleteTrip(dataBase, id)
                    .then( deletedTrip => {
                        console.log("Line 153:", deletedTrip)
                        return res.status(200).json({
                            success: "Trip hous been deleted"
                        });
                    });
            })
    });

module.exports = TripsRouter;