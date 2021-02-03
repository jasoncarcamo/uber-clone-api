const express = require("express");
const PassengerInfoRouter = express.Router();
const {requireAuth} = require("../../../middleware/jwtAuth");
const PassengerService = require("../../../services/PassengersService/PassengersService");

PassengerInfoRouter
    .route("/passenger-info")
    .all(requireAuth)
    .get((req, res)=>{
        const passenger = Object.assign({}, req.user);
        
        delete passenger.password;
        
        return res.status(200).json({
            passenger
        });
    })
    .post((req, res)=>{
        const {
            date_created,
            email,
            first_name,
            home_address,
            last_name,
            member,
            mobile_number,
            trip_redemption,
            work_address
        } = req.body;
        
        const updatePassenger = {
            date_created,
            email,
            first_name,
            home_address,
            last_name,
            member,
            mobile_number,
            trip_redemption,
            work_address
        }
        const id = req.user.id;

        for(const [key, value] of Object.entries(updatePassenger)){
            if(value === undefined){
                return res.status(400).json({
                    error: `Missing ${key}`
                });
            };
        };

        PassengerService.getPassengerById(req.app.get("db"), id)
            .then( dbPassenger => {
                if(!dbPassenger){
                    return res.status(404).json({
                        error: `Passenger with id ${id}, not found`
                    });
                };

                PassengerService.updatePassenger(req.app.get("db"), updatePassenger, id)
                    .then( updatedPassenger => {
                        console.log("Updated passenger: ", updatedPassenger);

                        return res.status(200).json({
                            updatedPassenger
                        });
                    });
            });
    });

module.exports = PassengerInfoRouter;