const express = require("express");
const DriverInfoRouter = express.Router();
const {requireAuth} = require("../../../middleware/jwtAuth");

DriverInfoRouter
    .route("/driver-info")
    .all(requireAuth)
    .get((req, res)=>{
        const driver = Object.assign({}, req.user);

        return res.status(200).json({
            driver
        });
    })
    .patch((req, res)=>{

    })
    .delete((req, res)=>{

    });

module.exports = DriverInfoRouter;