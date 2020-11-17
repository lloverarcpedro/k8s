"use strict";
const { Contract } = require("fabric-contract-api");
const ClientIdentity = require("fabric-shim").ClientIdentity;

class loadsContract extends Contract {
  async addLoad(
    ctx,
    contractId,
    loadId,
    commodityId,
    weight,
    sellerId,
    moisture,
    price
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
      let privateLoadPrice = {
        contractId: contractId,
        loadId: loadId,
        price: price,
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
      await ctx.stub.putPrivateData(
        "loadPricesPrivateDetailsCollection",
        loadId,
        Buffer.from(JSON.stringify(privateLoadPrice))
      );
      await ctx.stub.setEvent(
        "loadAdded",
        Buffer.from(JSON.stringify(contractAsJson))
      );
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
    let loadFound = "";
    loads.forEach((loadElement) => {
      if (loadElement["loadId"] == loadId) {
        loadFound = loadElement;
      }
    });
    if (!loadFound || loadFound.toString().length <= 0) {
      throw new Error("A load with this ID does not exist in this contract ");
    }
    let privateLoad = "";
    privateLoad = await ctx.stub.getPrivateData(
      "loadPricesPrivateDetailsCollection",
      loadId
    );
    console.log("Private load data:");
    console.log(privateLoad.toString());
    if (!privateLoad && privateLoad.toString().lenght <= 0) {
      console.log("Load Not Found Succesfully..");
    } else {
      loadFound["privatePrice"] = JSON.stringify(privateLoad.toString());
    }
    console.log("Load Found Succesfully..");
    return JSON.stringify(loadFound);
  }

  async getPrivateLoad(ctx, contractId, loadId) {
    let contractAsBytes = await ctx.stub.getState(contractId);
    if (!contractAsBytes || contractAsBytes.toString().length <= 0) {
      throw new Error("Contract with this Id does not exist: ");
    }
    const contract = JSON.parse(contractAsBytes.toString());
    console.log("Contract Status=", contract["status"]);
    const cid = new ClientIdentity(ctx.stub);

    if (
      cid.assertAttributeValue("hf.Affiliation", "commodity.seller") ||
      cid.assertAttributeValue("hf.Affiliation", "commodity.buyer") ||
      contract["status"] == "finished"
    ) {
      let privateLoad = await ctx.stub.getPrivateData(
        "loadPricesPrivateDetailsCollection",
        loadId
      );
      console.log("Private load data:",privateLoad.toString());
      
      if (!privateLoad && privateLoad.toString().lenght <= 0) {
        console.log("Load Not Found Succesfully..");
        throw new Error("No load found");
      }
      return JSON.stringify(privateLoad.toString());
    } else {
      let privateLoad = {};
      privateLoad["loads"] = "*********";
      privateLoad["message"] =
        "Only Commodity Seller or Commodity Buyer can get load's detailed information on OPEN Contracts";
      return JSON.stringify(privateLoad);
    }
  }
}

module.exports.loadsContract = loadsContract;
