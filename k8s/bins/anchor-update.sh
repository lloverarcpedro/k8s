#!/bin/sh

peer channel update -f ../config/grainchain-peer-update.tx -c airlinechannel -o $ORDERER_ADDRESS

