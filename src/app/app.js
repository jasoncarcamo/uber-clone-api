const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const {NODE_ENV} = require("../../config");

app.use(morgan((NODE_ENV === "production") ? "tiny" : "common"));
app.use(express.static("public"));
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(helmet());

//Driver routes start here
const DriverRegisterRouter = require("../routes/DriverRoutes/DriverRegisterRouter/DriverRegisterRouter");
const DriverLoginRouter = require("../routes/DriverRoutes/DriverLoginRouter/DriverLoginRouter");
const DriverInfoRouter = require("../routes/DriverRoutes/DriverInfoRouter/DriverInfoRouter");
const CurrentTripsRouter = require("../routes/DriverRoutes/CurrentTripsRouter/CurrentTripsRouter");
const DriverActiveRouter = require("../routes/DriverRoutes/DriverActiveRouter/DriverActiveRouter");
const UnacceptedTripRouter = require("../routes/DriverRoutes/UnacceptedTripRouter/UnacceptedRouter");

//Passenger routes start here
const PassengerRegisterRouter = require("../routes/PassengerRoutes/PassengerRegisterRouter/PassengerRegisterRouter");
const PassengersLoginRouter = require("../routes/PassengerRoutes/PassengersLoginRouter/PassengersLoginRouter");
const PassengerInfoRouter = require("../routes/PassengerRoutes/PassengerInfoRouter/PassengerInfoRouter");

//Trips routes start here
const TripsRouter = require("../routes/TripsRoutes/TripsRouter/TripsRouter");
const TripsFinderRouter = require("../routes/TripsRoutes/TripsFinderRouter/TripsFinderRouter");
const TripConfirmationRouter = require("../routes/TripsRoutes/TripConfirmationRouter/TripConfirmationRouter");

//Driver api routes
app.use("/api", DriverRegisterRouter);
app.use("/api", DriverLoginRouter);
app.use("/api", DriverInfoRouter);
app.use("/api/", CurrentTripsRouter);
app.use("/api", DriverActiveRouter);
app.use("/api", UnacceptedTripRouter);

//Passenger api routes
app.use("/api", PassengerRegisterRouter);
app.use("/api", PassengersLoginRouter);
app.use("/api", PassengerInfoRouter)

//Trips api routes
app.use("/api", TripsRouter);
app.use("/api", TripsFinderRouter);
app.use("/api", TripConfirmationRouter);

app.use(function errorHandler(error, req, res, next) {
    let response;

    if (NODE_ENV === 'production') {
        response = { error: 'Server error' };
    } else {
        console.error(error)
        response = { error: error.message, object: error };
    };

    return res.status(500).json(response);
});

module.exports = app;