"use strict";

const truckContract = require('./contract/truck-contract').truckContract;
const grainContract = require('./contract/grain-contract').grainContract;
const loadsContract = require('./contract/loads-contract').loadsContract;

module.exports.grainContract = grainContract;
module.exports.truckContract = truckContract;
module.exports.loadsContract = loadsContract;

module.exports.contracts = [truckContract, grainContract, loadsContract];
