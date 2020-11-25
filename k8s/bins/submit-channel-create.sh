#!/bin/sh
peer channel create -c airlinechannel -f ../config/airlinechannel.tx --outputBlock ../config/airlinechannel.block -o $ORDERER_ADDRESS --tls --cafile ../peers/peer1-harvx-grainchain-io/tls-msp/tlscacerts/tls-0-0-0-0-7052.pem

