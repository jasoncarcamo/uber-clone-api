const express = require("express");
const PassengerInfoRouter = express.Router();
const {requireAuth} = require("../../../middleware/jwtAuth");
const PassengerService = require("../../../services/PassengersService/PassengersService");

PassengerInfoRouter
    .route("/passenger-info")
    .all(requireAuth)
    .get((req, res)=>{
        const passenger = Object.assign({}, req.user);

        return res.status(200).json({
            passenger
        });
    })
    .patch((req, res)=>{
        const {
            first_name,
            last_name,
            mobile_number,
            email,
            home_address,
            work_address,
            trip_redemption,
            member
        } = req.body;
        
        const passenger = {
            id: req.user.id,
            first_name,
            last_name,
            mobile_number,
            email,
            home_address,
            work_address,
            trip_redemption,
            member
        };

        for(const [key, value] of Object.entries(passenger)){
            if(value === undefined){
                return res.status(400).json({
                    error: `Missing ${key}`
                });
            };
        };

        PassengerService.getPassengerById(req.app.get("db"), passenger.id)
            .then( dbPassenger => {
                if(!dbPassenger){
                    return res.status(404).json({
                        error: `Passenger with id ${id}, not found`
                    });
                };

                PassengerService.updatePassenger(req.app.get("db"), updatePassenger, id)
                    .then( updatedPassenger => {

                        return res.status(200).json({
                            updatedPassenger
                        });
                    });
            });
    });

module.exports = PassengerInfoRouter;