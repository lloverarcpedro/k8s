#!/bin/sh
peer channel fetch 0 ../config/airlinechannel.block -o $ORDERER_ADDRESS -c airlinechannel --tls --cafile ../peers/peer1-harvx-grainchain-io/tls-msp/tlscacerts/tls-0-0-0-0-7052.pem