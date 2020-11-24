"use strict";
const { Contract } = require("fabric-contract-api");
const ClientIdentity = require("fabric-shim").ClientIdentity;

class loadsContract extends Contract {

  /*----> Add a new commodity load to contrac <----
  - change contract status from empty to loading
  - add load weigth to contract current weigth
  - only owners can add loads to contract
  */
  async addLoad(ctx, contractId, loadId, commodityId, weight, moisture, price ) {
    try {
      //Requester ID
      const requesterId = ctx.clientIdentity.getID().toString();

      let load = {
        contractId: contractId,
        loadId: loadId,
        commodityId: commodityId,
        weight: weight,
        sellerId: requesterId,
        moisture: moisture,
        price: price
      };

      let contractAsBytes = await ctx.stub.getState(contractId);
      if (!contractAsBytes || contractAsBytes.toString().length <= 0) {
        throw new Error("ERROR: Contract with this Id does not exist: ");
      }
      console.log("Contract Before Load: ", contractAsBytes.toString());
      let contractAsJson = JSON.parse(contractAsBytes.toString());

      //check if requester is in owner list
      const ownerList = contractAsJson["dataOwner"]
      if(ownerList.indexOf(requesterId) < 0 ){
        throw new Error("ERROR: You are not allowed to add loads to this contract");
      }

      //check contract status
      if(contractAsJson["status"] == "finished"){
        throw new Error("ERROR: conctract has been completed");
      }

      //check contract max weigth
      const currentWeigth = contractAsJson["currentWeigth"];
      const maxWeigth = contractAsJson["maxWeight"];
      if((currentWeigth-0)+(weight-0) > (maxWeigth-0)){
        const left = (maxWeigth-0)-(currentWeigth-0)
        console.log("ERROR: Load weigth exceeds contract max weigth, needed: ", left)
        throw new Error("ERROR: Load weigth exceeds contract max weigth, needed: "+ left.toString());
      }

      //Check if accepting this kind of commodity
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

      contractAsJson["currentWeigth"] = (currentWeigth-0) + (weight-0);

      //Update contract status if al loads has been added
      if((currentWeigth-0) + (weight-0) >= (maxWeigth-0)){
        contractAsJson["status"]="finished"
      }else{
        contractAsJson["status"]="loading"
      }

      await ctx.stub.putState(
        contractId,
        Buffer.from(JSON.stringify(contractAsJson))
      );
      await ctx.stub.setEvent("loadAdded", Buffer.from(JSON.stringify(contractAsJson)));
      return "Load Added To Contract Succesfully..";
    } catch (error) {
      console.log("Error catched: ", error.message);
      return error.message;
    }
  }


  /*----> Get a commodity load from contrac <----
  - only viewers can get loads from contract
  */
  async getLoad(ctx, contractId, loadId) {
    //Requester ID
    const requesterId = ctx.clientIdentity.getID().toString();

    const contractAsBytes = await ctx.stub.getState(contractId);

    if (!contractAsBytes || contractAsBytes.toString().length <= 0) {
      throw new Error("Contract with this Id does not exist: ");
    }

    const contract = JSON.parse(contractAsBytes.toString());
    const viewers = contract["dataViewer"]
    if(viewers.indexOf(requesterId) < 0 ){
      throw new Error("ERROR: You are not allowed to see this information contract");
    }

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
