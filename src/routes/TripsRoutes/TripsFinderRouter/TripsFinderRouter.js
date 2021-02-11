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
            .then( trip => {

                if(!trip){
                    return res.status(404).json({
                        error: "No trip found near by"
                    });
                };

                const updateTrip = Object.assign({}, trip);

                updateTrip.driver_viewing = true;
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