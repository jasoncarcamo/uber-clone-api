const DriversTripService = {
    getDriverActiveTrips(db, driverId){
        return db.select("*").from("trips").where({
            driver_id: driverId,
            driver_accepted: true,
            trip_complete: false
        });
    },
    updateDriverTripById(db, updateTrip, driverId, tripid){
        return db.update(updateTrip).from("trips").where({
            driver_id: driverId,
            id: tripid
        }).returning("*").then(([updatedTrip]) => updatedTrip);
    }
}


module.exports = DriversTripService;