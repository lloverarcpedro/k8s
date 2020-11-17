"use strict";
const { Contract } = require("fabric-contract-api");

class loadsContract extends Contract {
  async addLoad(
    ctx,
    contractId,
    loadId,
    commodityId,
    weight,
    sellerId,
    moisture
  ) {
    try {
      let load = {
        contractId: contractId,
        loadId: loadId,
        commodityId: commodityId,
        weight: weight,
        sellerId: sellerId,
        moisture: moisture,
      };

      let contractAsBytes = await ctx.stub.getState(contractId);
      if (!contractAsBytes || contractAsBytes.toString().length <= 0) {
        throw new Error("ERROR: Contract with this Id does not exist: ");
      }
      console.log("Contract Before Load: ", contractAsBytes.toString());
      let contractAsJson = JSON.parse(contractAsBytes.toString());

      if (contractAsJson["commodityId"] != load["commodityId"]) {
        throw new Error(
          "ERROR: Contract accepts only " +
            contractAsJson["commodityId"].toString()
        );
      }

      let cLoads = contractAsJson["loads"];
      if (!cLoads || cLoads.toString().length <= 0) {
        contractAsJson["loads"] = new Array();
      }
      contractAsJson["loads"].push(load);

      await ctx.stub.putState(
        contractId,
        Buffer.from(JSON.stringify(contractAsJson))
      );
      await ctx.stub.setEvent("loadAdded", Buffer.from(JSON.stringify(contractAsJson)))
      return "Load Added To Contract Succesfully..";
      console.log("User Info", ctx.clientIdentity.getID().toString());
    } catch (error) {
      console.log("Error catched: ", error.message);
      return error.message;
    }
  }

  async getLoad(ctx, contractId, loadId) {
    const contractAsBytes = await ctx.stub.getState(contractId);

    if (!contractAsBytes || contractAsBytes.toString().length <= 0) {
      throw new Error("Contract with this Id does not exist: ");
    }

    const contract = JSON.parse(contractAsBytes.toString());
    const loads = contract["loads"];
    if (!loads || loads.toString().length <= 0) {
      throw new Error("This contract has no loads yet");
    }
    let loadFound = ''
    loads.forEach((loadElement) => {
      if (loadElement["loadId"] == loadId) {
        loadFound = loadElement;
      }
    });
    if (!loadFound || loadFound.toString().length <= 0) {
      throw new Error("A load with this ID does not exist in this contract ");
    }

    console.log("Load Found Succesfully..");
    return JSON.stringify(loadFound);
  }
}

module.exports.loadsContract = loadsContract;
