const PassengersService = {
    getPassengersByOptions(db, options){
        return db.select("*").from("passengers").where(options);
    },
    getAllPassengers(db){
        return db.select("*").from("passengers");
    },
    getPassengerById(db, id){
        return db.select("*").from("passengers").where({id}).first();
    },
    getPassengerByMobileNumber(db, mobile_number){
        return db.select("*").from("passengers").where({mobile_number}).first();
    },
    createPassenger(db, newPassenger){
        return db.insert(newPassenger).into("passengers").returning("*").then(([createdPassenger]) => createdPassenger);
    },
    updatePassenger(db, updatePassenger, id){
        return db.update(updatePassenger).from("passengers").where({id}).returning("*").then(([updatedPassenger]) => updatedPassenger);
    },
    deletePassenger(db, id){
        return db.delete().from("passenegers").where({id});
    }
};

module.exports = PassengersService;