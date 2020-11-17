"use strict";

class TruckModel {

    async truck(id, make, model, year, color){
        this.id = id;
        this.make = make;
        this.model= model;
        this.year =year;
        this.color =  color;
    
        return this
    }

}

module.exports = TruckModel;

