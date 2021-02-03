const express = require("express");
const DriverInfoRouter = express.Router();
const {requireAuth} = require("../../../middleware/jwtAuth");

DriverInfoRouter
    .route("/driver-info")
    .all(requireAuth)
    .get((req, res)=>{
        const driver = Object.assign({}, req.user);

        delete driver.password;

        return res.status(200).json({
            driver
        });
    })

module.exports = DriverInfoRouter;