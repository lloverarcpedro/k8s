# Updated to Fabric 2.x
#1. Docker file for setting up the Orderer
# FROM hyperledger/fabric-orderer:1.4.2
FROM hyperledger/fabric-orderer:2.1

LABEL  maintainer="pllovera@grainchain.io"

#2. Create the folder for configurations
RUN mkdir -p /var/hyperledger/config
RUN mkdir -p /var/hyperledger/orgMSP

#3. Copy the crypto for orderer
COPY ./config/crypto-config/ordererOrganizations/orderers/orderers/orderer3-grainchain-io /var/hyperledger/orderer.grainchain.io
COPY ./config/crypto-config/ordererOrganizations/orderers/msp /var/hyperledger/orgMSP

#4. Copy the genesis file
COPY ./config/orderer/airlinegenesis.block  /var/hyperledger/config/airlinegenesis.block

#5. Copy the orderer YAML
COPY ./config/orderer/orderer3.yaml /var/hyperledger/config/orderer.yaml

#6. Launch the Orderer
CMD orderer

