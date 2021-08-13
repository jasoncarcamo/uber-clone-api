const TripServices = {
    getTripsByZipCode(db, pick_up_zip_code){

        return db.select("*").from("trips").where({
            pick_up_zip_code,
            driver_accepted: false,
            driver_viewing: false
        }).orderBy("date_created");
    },
    getTripByRadius(db, position){
        const twoMileRadius = 3.5 / 69;
        const northBoundRadius = position.last_known_lat + twoMileRadius;
        const southBoundRadius = position.last_known_lat - twoMileRadius;
        const eastBoundRadius = position.last_known_lng + twoMileRadius;
        const westBoundRadius = position.last_known_lng - twoMileRadius;

        return db.select("*")
            .from("trips")
            .where({
                driver_accepted: false,
                driver_viewing: false
            })
            .whereBetween("pick_up_lat", [southBoundRadius, northBoundRadius])
            .whereBetween("pick_up_lng", [eastBoundRadius, westBoundRadius])
            .orderBy("date_created");
    },
    getTripById(db, id){
        return db.select("*").from("trips").where({id}).first();
    },
    createTrip(db, newTrip){
        return db.insert(newTrip).into("trips").returning("*").then(([createdTrip])=> createdTrip);
    },
    updateTrip(db, updateTrip, id){
        return db.update(updateTrip).from("trips").where({id}).returning("*").then(([updatedTrip]) => updatedTrip);
    },
    deleteTrip(db, id){
        return db.delete().from("trips").where({id});
    }
};

module.exports = TripServices;