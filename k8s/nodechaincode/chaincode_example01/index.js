"use strict";

const truckContract = require('./contract/truck-contract').truckContract;
const futureContract = require('./contract/future-contract').futureContract;
const loadsContract = require('./contract/loads-contract').loadsContract;

module.exports.truckContract = truckContract;
module.exports.futureContract = futureContract;
module.exports.loadsContract = loadsContract;


module.exports.contracts = [ truckContract, futureContract, loadsContract ];
