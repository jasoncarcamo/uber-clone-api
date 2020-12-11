const UserService = {
    getDriversByOptions(db, options){
        return db.select("*").from("drivers").where(options);
    },
    getAllDrivers(db){
        return db.select("*").from("drivers");
    },
    getDriverById(db, id){
        return db.select("*").from("drivers").where({id}).first();
    },
    getDriverByMobileNumber(db, mobile_number){
        return db.select("*").from("drivers").where({mobile_number}).first();
    },
    createDriver(db, newDriver){
        return db.insert(newDriver).into("drivers").returning("*").then(([createdDriver]) => createdDriver);
    },
    updateDriver(db, updateDriver, id){
        return db.update(updateDriver).from("drivers").where({id}).returning("*").then(([updatedDriver]) => updatedDriver);
    },
    deleteDriver(db, id){
        return db.delete().from("drivers").where({id});
    }
};

module.exports = UserService;