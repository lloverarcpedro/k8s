

export CC_LANGUAGE=node
export PACKAGE_NAME=gcnodecct
export CC_CHANNEL_ID=grainchainchannel
export CC_LABEL=gcnodecc.1.0-1.0
export TLS_PARAMETERS=--tls
export CC2_INIT_REQUIRED=--init-required
export CC_CONSTRUCTOR={"Args":[]}
export GOPATH=/fabric/gopath
export ORDERER_ADDRESS=orderer1.grainchain.io:7050
export CC_NAME=gcnodecc
export CC2_PACKAGE_FOLDER=./package


peer lifecycle chaincode package $CC2_PACKAGE_FOLDER/$PACKAGE_NAME -p $CC_PATH --label=$CC_LABEL -l $CC_LANGUAGE
sleep 20 

peer lifecycle chaincode install  $CC2_PACKAGE_FOLDER/$PACKAGE_NAME --tls 
sleep 20

peer lifecycle chaincode queryinstalled

peer lifecycle chaincode approveformyorg --channelID $CC_CHANNEL_ID  --name $CC_NAME --version $CC_VERSION --package-id $PACKAGE_ID --sequence $CC2_SEQUENCE $CC2_INIT_REQUIRED -o $ORDERER_ADDRESS $TLS_PARAMETERS --waitForEvent --cafile $TLS_CA_CERT
sleep 30

#### INSTANTIATE ###
peer lifecycle chaincode commit -C $CC_CHANNEL_ID -n $CC_NAME -v $CC_VERSION \
                --sequence $CC2_SEQUENCE  $CC2_INIT_REQUIRED    --waitForEvent \
                --tls --cafile $TLS_CA_CERT
sleep 20

### INIT CHAINCODE ###
peer chaincode invoke  -C $CC_CHANNEL_ID -n $CC_NAME -c $CC_CONSTRUCTOR --isInit --waitForEvent -o $ORDERER_ADDRESS $TLS_PARAMETERS --cafile $TLS_CA_CERT
sleep 10

peer chaincode invoke -C $CC_CHANNEL_ID -n $CC_NAME  -c '{"Args":["addTruck","002","DINA","MODELA43","2022","BLUE"]}' $TLS_PARAMETERS --cafile $TLS_CA_CERT
sleep 10

peer chaincode query -C $CC_CHANNEL_ID -n $CC_NAME  -c '{"Args":["getTruck","002"]}' $TLS_PARAMETERS --cafile $TLS_CA_CERT
