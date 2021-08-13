const express = require("express");
const TripsFinderRouter = express.Router();
const {requireAuth} = require("../../../middleware/jwtAuth");
const TripServices = require("../../../services/TripServices/TripServices");

TripsFinderRouter
    .route("/trip/find/:lat/:lng")
    .all(requireAuth)
    .get((req, res)=>{
        const position = {
            last_known_lat: Number(req.params.lat),
            last_known_lng: Number(req.params.lng)
        };
        const dataBase = req.app.get("db");

        TripServices.getTripByRadius(dataBase, position)
            .then( trips => {
                let trip;
                let newTrips = trips;
                let foundTrip = false;
                if(trips.length === 0){
                    return res.status(404).json({
                        error: "No trips found near by"
                    });
                };
                
                // while loops looks to see if trip was not last seen by current driver request
                while(!foundTrip){
                    if(newTrips.length === 0){
                        return res.status(404).json({
                            error: "No trip found near by"
                        });
                    };

                    trip = newTrips[0];

                    if(trip.last_driver_viewed !== req.user.id){
                        foundTrip = true;
                    } else{
                        newTrips = newTrips.slice(1);
                    };
                };

                const updateTrip = Object.assign({}, trip);

                updateTrip.driver_viewing = true;
                updateTrip.last_driver_viewed = req.user.id;
                updateTrip.driver_id = req.user.id;

                TripServices.updateTrip(dataBase, updateTrip, updateTrip.id)
                    .then( updatedTrip => {

                        return res.status(200).json({
                            trip: updatedTrip
                        });
                    });
            });
    })

module.exports = TripsFinderRouter;