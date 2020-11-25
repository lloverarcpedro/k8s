#!/bin/sh
#After running this script confirm that peer has joined
#by running peer channel list
export CORE_PEER_ADDRESS='grainchain-peer1-clusterip:30751'
peer channel join   -b ../config/airlinechannel.block -o $ORDERER_ADDRESS --tls --cafile ../peers/peer1-harvx-grainchain-io/tls-msp/tlscacerts/tls-0-0-0-0-7052.pem