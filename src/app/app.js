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

//Passenger routes start here
const PassengerRegisterRouter = require("../routes/PassengerRoutes/PassengerRegisterRouter/PassengerRegisterRouter");
const PassengersLoginRouter = require("../routes/PassengerRoutes/PassengersLoginRouter/PassengersLoginRouter");
const PassengerInfoRouter = require("../routes/PassengerRoutes/PassengerInfoRouter/PassengerInfoRouter");

//Driver api routes
app.use("/api", DriverRegisterRouter);
app.use("/api", DriverLoginRouter);
app.use("/api", DriverInfoRouter);

//Passenger api routes
app.use("/api", PassengerRegisterRouter);
app.use("/api", PassengersLoginRouter);
app.use("/api", PassengerInfoRouter)

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