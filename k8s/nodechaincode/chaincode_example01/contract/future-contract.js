"use strict";
const { Contract } = require("fabric-contract-api");
const ClientIdentity = require("fabric-shim").ClientIdentity;

class futureContract extends Contract {
  /* ----> Create a new future commodity trade contrac <----
  - @creator user acts as owner.
  - @owner is the default @viewer
  - Contract Creator also is @buyer.
  - @status Possibles values are empty, loading, finished. All contracts start as empty.
  */
  async addFuture(ctx, contractId, maxWeight, commodityId) {
    const ownerId = ctx.clientIdentity.getID().toString();

    let contract = {
      contractId: contractId,
      buyerId: ctx.clientIdentity.getID().toString(),
      maxWeight: maxWeight,
      commodityId: commodityId,
      currentWeigth: 0,
      status: "empty",
      creator: ownerId,
      dataOwner: [ownerId],
      dataViewer: [ownerId],
    };
    try {
      //check if already exists
      const already = await ctx.stub.getState(contractId);
      if (already && already.toString().length > 0) {
        throw new Error(
          "ERROR: Contract with this Id already exists, us update transaction or use different contract id to create a new one"
        );
      }
      //Create new future contract
      await ctx.stub.putState(
        contractId,
        Buffer.from(JSON.stringify(contract))
      );
      console.log("Contract Added To The Ledger Succesfully..");
      console.log("User Info", ctx.clientIdentity.getID().toString());
      await ctx.stub.setEvent(
        "contractAdded",
        Buffer.from(JSON.stringify(contract))
      );
      return "Contract Added To The Ledger Succesfully...";
    } catch (error) {
      return error.message;
    }
  }

  /*  ---> Returns a contract only if requester is in dataViewer list <--- 
    - get @requesterId from requester identity
    - returns an error if requester isn't in viewers list.
  */
  async getFuture(ctx, contractId) {
    const requesterId = ctx.clientIdentity.getID().toString();

    const cid = new ClientIdentity(ctx.stub);
    console.log(cid.getX509Certificate().issuer.organizationName);

    const contractAsBytes = await ctx.stub.getState(contractId);
    if (!contractAsBytes || contractAsBytes.toString().length <= 0) {
      throw new Error("ERROR: Contract with this Id does not exist: ");
    }
    let contract = JSON.parse(contractAsBytes.toString());
    console.log("Contract Found Succesfully...");
    contract["gc.area"] = cid.getAttributeValue("gc.area");
    contract["gc.affiliation"] = cid.getAttributeValue("gc.affiliation");
    contract["hf.Affiliation"] = cid.getAttributeValue("hf.Affiliation");

    const viewers = contract["dataViewer"];

    if (viewers.indexOf(requesterId) >= 0) {
      return JSON.stringify(contract);
    } else {
      return "ERROR: You are not allowed to see this information.";
    }
  }

  /* ----> Add @owner to Contract <----
  - Only contract Owners cand add new Owner.
  - Check if @newOwner is not already added
  - @newOwnerId format ---> "x509::/OU=seller+OU=silosys+OU=general/CN=silosys@silosys.io::/C=US/ST=Texas/L=McAllen/O=grainchain/OU=harvx/CN=cert-auth.grainchain"
  - @contractId ---> Id of the contract to add owner
  */
  async addOwner(ctx, contractId, newOwnerId) {
    const requesterId = ctx.clientIdentity.getID().toString();

    try {
      const contractAsBytes = await ctx.stub.getState(contractId);
      if (!contractAsBytes || contractAsBytes.toString().length <= 0) {
        throw new Error("ERROR: Contract with this Id does not exist");
      }

      let contract = JSON.parse(contractAsBytes.toString());
      const currentOwners = contract["dataOwner"];
      const currentViewers = contract["dataViewer"];
      //Check if requester is in Owner
      if (currentOwners.indexOf(requesterId) < 0) {
        throw new Error("ERROR: You are not allowed to change contract owners");
      }

      //check if not already added
      if (currentOwners.indexOf(newOwnerId) >= 0) {
        throw new Error("ERROR: Owner already added.");
      }

      contract["dataOwner"].push(newOwnerId);
      //Add Viewer only if not already viewer
      if (currentViewers.indexOf(newOwnerId) <= 0) {
        contract["dataViewer"].push(newOwnerId);
      }

      //Put the modified future contract
      await ctx.stub.putState(
        contractId,
        Buffer.from(JSON.stringify(contract))
      );
      return "Contract new owner added succesfully...";
    } catch (error) {
      return error.message;
    }
  }

  /* ----> Add @viewer to Contract <----
  - Only contract Owners cand add new Viewer.
  - Check if @newViewer is not already added
  - @newViewerId format ---> "x509::/OU=seller+OU=silosys+OU=general/CN=silosys@silosys.io::/C=US/ST=Texas/L=McAllen/O=grainchain/OU=harvx/CN=cert-auth.grainchain"
  - @contractId ---> Id of the contract to add owner
   */
  async addViewer(ctx, contractId, newViewerId) {
    const requesterId = ctx.clientIdentity.getID().toString();
    try {
      //check if contract exists
      const contractAsBytes = await ctx.stub.getState(contractId);
      if (!contractAsBytes || contractAsBytes.toString().length <= 0) {
        throw new Error("ERROR: Contract with this Id does not exist");
      }

      let contract = JSON.parse(contractAsBytes.toString());
      const currentOwners = contract["dataOwner"];
      const currentViewers = contract["dataViewer"];
      //Check if requester is in Owner
      if (currentOwners.indexOf(requesterId) < 0) {
        throw new Error(
          "ERROR: You are not allowed to change contract Viewers"
        );
      }

      //check if not already added
      if (currentOwners.indexOf(newViewerId) >= 0) {
        throw new Error("ERROR: Viewer already added.");
      }

      //Add new Viewer
      contract["dataViewer"].push(newViewerId);
      await ctx.stub.putState(
        contractId,
        Buffer.from(JSON.stringify(contract))
      );
      return "Contract new viewer added succesfully...";
    } catch (error) {
      return error.message;
    }
  }

  /* ----> Remove @Owner from Contract <----
  - Doesn't remove viewer. 
  - Can remove any owners excepts the creator
  */
  async removeOwner(ctx, contractId, ownerId) {
    const requesterId = ctx.clientIdentity.getID().toString();
    try {
      //check if contract exists
      const contractAsBytes = await ctx.stub.getState(contractId);
      if (!contractAsBytes || contractAsBytes.toString().length <= 0) {
        throw new Error("ERROR: Contract with this Id does not exist");
      }
      let contract = JSON.parse(contractAsBytes.toString());
      const currentOwners = contract["dataOwner"];
      //Check if requester is in Owner
      if (currentOwners.indexOf(requesterId) < 0) {
        throw new Error("ERROR: You are not allowed to change contract Owners");
      }
      //check if already added
      const indexOwner = currentOwners.indexOf(ownerId);
      if (indexOwner < 0) {
        throw new Error("ERROR: OwnerId isn't owner of this contract");
      }

      //check if it is the creator
      if(contract["creator"]==ownerId){
        throw new Error("ERROR: Creator's ownership can't be deleted");
      }

      //Remove Ownership
      contract["dataOwner"].splice(indexOwner, 1);
      //Update contract
      await ctx.stub.putState(
        contractId,
        Buffer.from(JSON.stringify(contract))
      );
      return "Contract ownership updated succesfully...";
    } catch (error) {
      return error.message;
    }
  }

  /* ----> Remove @viewer from Contract <----
  - Also remove ownership. 
  - Can remove any @viewer excepts the creator
  */
  async removeViewer(ctx, contractId, viewerId) {
    const requesterId = ctx.clientIdentity.getID().toString();
    try {
      //check if contract exists
      const contractAsBytes = await ctx.stub.getState(contractId);
      if (!contractAsBytes || contractAsBytes.toString().length <= 0) {
        throw new Error("ERROR: Contract with this Id does not exist");
      }
      let contract = JSON.parse(contractAsBytes.toString());
      const currentOwners = contract["dataOwner"];
      //Check if requester is in Owner
      if (currentOwners.indexOf(requesterId) < 0) {
        throw new Error("ERROR: You are not allowed to change contract Viewers");
      }
      
      //check if it is the creator
      if(contract["creator"]==viewerId){
        throw new Error("ERROR: Creator's view capability can't be removed");
      }

      const currentViewers = contract["dataViewer"];
      //Check if it is a viewer
      const indexViewer= currentViewers.indexOf(viewerId)
      if(indexViewer < 0){
        throw new Error ("ERROR: viewerId isn't a viewer of this contract")
      }
      //Remove Viewer
      contract["dataViewer"].splice(indexViewer, 1);
      //check if it is owner
      const indexOwner = currentOwners.indexOf(viewerId);
      if (indexOwner > 0) {
        //Remove Ownership
        contract["dataOwner"].splice(indexOwner, 1);
      }
      
      //Update contract
      await ctx.stub.putState(
        contractId,
        Buffer.from(JSON.stringify(contract))
      );
      return "Contract viewers updated succesfully...";
    } catch (error) {
      return error.message;
    }
  }
}

module.exports.futureContract = futureContract;
