const express = require("express");
const TripConfirmationRouter = express.Router();
const {requireAuth} = require("../../../middleware/jwtAuth");
const TripServices = require("../../../services/TripServices/TripServices");

TripConfirmationRouter
    .route("/trip/confirmation/:id")
    .all(requireAuth)
    .patch((req, res)=>{
        const {
            driver_id,
            driver_viewing,
            driver_accepted
        } = req.body;

        const updateTrip = {
            driver_id,
            driver_viewing,
            driver_accepted
        };
        const id = req.params.id;
        const dataBase = req.app.get("db");

        for(const [key, value] of Object.entries(updateTrip)){
            if(value === undefined){
                return res.status(400).json({
                    error: `Missing ${key}`
                });
            };
        };

        TripServices.getTripById(dataBase, id)
            .then( trip => {
                if(!trip){

                    return res.status(404).json({
                        error: "Trip not found"
                    });
                };

                TripServices.updateTrip(dataBase, updateTrip, id)
                    .then( updatedTrip => {

                        return res.status(200).json({
                            updatedTrip
                        });
                    });
            });
    });

module.exports = TripConfirmationRouter;