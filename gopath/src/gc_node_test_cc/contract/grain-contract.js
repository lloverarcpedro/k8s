"use strict";
const { Contract } = require("fabric-contract-api");

class grainContract extends Contract {
  async addContract(ctx,contractId, buyerId, maxWeight, commodityId) {
    let contract = {
      contractId: contractId,
      buyerId: buyerId,
      maxWeight: maxWeight,
      commodityId : commodityId
    };

    await ctx.stub.putState(contractId, Buffer.from(JSON.stringify(contract)));
    console.log("Contract Added To The Ledger Succesfully..");
    console.log("User Info",ctx.clientIdentity.getID().toString())
  }

  async getContract(ctx, contractId) {
    let contractAsBytes = await ctx.stub.getState(contractId);
    if (!contractAsBytes || contractAsBytes.toString().length <= 0) {
      throw new Error("Contract with this Id does not exist: ");
    }
    let contract = JSON.parse(contractAsBytes.toString());
    console.log("Contract Found Succesfully..");
    return JSON.stringify(contract);
  }

}

module.exports.grainContract = grainContract;
