const DriversTripService = {
    getDriverActiveTrips(db, driverId){
        return db.select("*").from("trips").where({
            driver_id: driverId,
            driver_accepted: true,
            trip_complete: false
        });
    },
    updateDriverTripById(db, updateTrip, driverId, tripId){
        return db.update(updateTrip).from("trips").where({
            driver_id: driverId,
            id: tripId
        }).returning("*").then(([updatedTrip]) => updatedTrip);
    }
};

module.exports = DriversTripService;