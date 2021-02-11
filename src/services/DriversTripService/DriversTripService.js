const DriversTripService = {
    getDriverUnacceptedTrip(db, driver_id){
        return db.select("*").from("trips").where({
            driver_id,
            driver_viewing: true,
            driver_accepted: false
        }).first();
    },
    getDriverActiveTrips(db, driver_id){
        return db.select("*").from("trips").where({
            driver_id,
            driver_accepted: true,
            trip_complete: false
        })
        .first();
    },
    updateDriverTripById(db, updateTrip, driver_id, tripId){
        return db.update(updateTrip).from("trips").where({
            driver_id,
            id: tripId
        }).returning("*").then(([updatedTrip]) => updatedTrip);
    }
};

module.exports = DriversTripService;