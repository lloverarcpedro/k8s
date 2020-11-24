"use strict";
const { Contract } = require("fabric-contract-api");

class truckContract extends Contract {

  async addTruck(ctx, truckId, make, model, year, color) {
    let truck = {
      make: make,
      model: model,
      year: year,
      color: color,
    };

    await ctx.stub.putState(truckId, Buffer.from(JSON.stringify(truck)));
    console.log("Truck added To the ledger Succesfully..");
  }

  async getTruck(ctx, truckId) {
    let truckAsBytes = await ctx.stub.getState(truckId);
    if (!truckAsBytes || truckAsBytes.toString().length <= 0) {
      throw new Error("truck with this Id does not exist: ");
    }
    let truck = JSON.parse(truckAsBytes.toString());

    return JSON.stringify(truck);
  }
  
}

module.exports.truckContract = truckContract;
