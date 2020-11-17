"use strict";
const { Contract } = require("fabric-contract-api");
const ClientIdentity = require ("fabric-shim").ClientIdentity;

class grainContract extends Contract {
  async addContract(ctx,contractId, buyerId, maxWeight, commodityId, status = "init") {
    let contract = {
      contractId: contractId,
      buyerId: buyerId,
      maxWeight: maxWeight,
      commodityId : commodityId,
      status: status
    };

    await ctx.stub.putState(contractId, Buffer.from(JSON.stringify(contract)));
    console.log("Contract Added To The Ledger Succesfully..");
    console.log("User Info",ctx.clientIdentity.getID().toString())
  }

  async getContract(ctx, contractId) {
    const cid = new ClientIdentity(ctx.stub)
    console.log(cid.getX509Certificate().issuer.organizationName)
    let contractAsBytes = await ctx.stub.getState(contractId);
    if (!contractAsBytes || contractAsBytes.toString().length <= 0) {
      throw new Error("Contract with this Id does not exist: ");
    }
    let contract = JSON.parse(contractAsBytes.toString());
    console.log("Contract Found Succesfully...");
    contract["gc.area"] = cid.getAttributeValue("gc.area")
    contract["gc.affiliation"] = cid.getAttributeValue("gc.affiliation")
    contract["hf.Affiliation"] = cid.getAttributeValue("hf.Affiliation")
    return JSON.stringify(contract);
  }

  async putContract(ctx,contractId,status){
    let contractAsBytes = await ctx.stub.getState(contractId);
    if (!contractAsBytes || contractAsBytes.toString().length <= 0) {
      throw new Error("Contract with this Id does not exist: ");
    }
    const contract =  JSON.parse(contractAsBytes.toString());
    contract["status"]=status;
    const stringContract = JSON.stringify(contract)
    await ctx.stub.putState(contractId, Buffer.from(stringContract));
    return stringContract;
  }

}

module.exports.grainContract = grainContract;
