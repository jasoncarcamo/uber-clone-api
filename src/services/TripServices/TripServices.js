const TripServices = {
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