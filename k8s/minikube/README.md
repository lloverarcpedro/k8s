

Dashboard
=========
> minikube dashboard

Start | Stop | Status
=====================
minkube start
minikube stop
minikube status

Launching
=========
> kubectl apply -f .

Pod Status
===========
> kubectl get all

Log into a container
====================
* Make sure the container/pod is running using the "kubectl get all"
kubectl exec -it grainchain-orderer-0 sh
kubectl exec -it grainchain-peer-0 sh
kubectl exec -it commodity-peer-0 sh

==================
1. Launch the Pods
==================
* Video shows the launch of pods one by one, here we are launching all at the same time
> cd minikube
> kubectl apply -f .

==================
2. Grainchain Peer Setup
==================
Log into the grainchain peer:
> kubectl exec -it grainchain-peer-0 sh

Setup the peer:
> ./submit-channel-create.sh
> ./join-channel.sh


Validate the peer:
> ./cc-test.sh install
> ./cc-test.sh instantiate
> ./cc-test.sh invoke  
> ./cc-test.sh query
> exit


#export CC_CONSTRUCTOR='{"Args":["init","a","100","b","200"]}'
export CC_CONSTRUCTOR='{"Args":[]}'
# export CC_NAME="nodecc"
export CC_NAME="nodecc01"
#export CC_PATH="/var/hyperledger/nodechaincode/chaincode_example02"
export CC_PATH="/var/hyperledger/nodechaincode/chaincode_example01"
export CC_VERSION="1.0"
export CC_CHANNEL_ID="airlinechannel"
export CC_LANGUAGE="node"

# Version 2.x
export INTERNAL_DEV_VERSION="1.0"
export CC2_PACKAGE_FOLDER="/var/hyperledger/packages"
export CC2_SEQUENCE=1
export CC2_INIT_REQUIRED="--init-required"

export OUTPUT=$(peer lifecycle chaincode queryinstalled -O json)
export PACKAGE_ID=$(echo $OUTPUT | jq -r ".installed_chaincodes[]|select(.label==\"$LABEL\")|.package_id")

peer lifecycle chaincode approveformyorg --channelID $CC_CHANNEL_ID  --name $CC_NAME --version $CC_VERSION --package-id $PACKAGE_ID --sequence $CC2_SEQUENCE $CC2_INIT_REQUIRED -o $ORDERER_ADDRESS  --waitForEvent --tls --cafile ../peers/peer1-harvx-grainchain-io/tls-msp/tlscacerts/tls-0-0-0-0-7052.pem




peer lifecycle chaincode commit -C $CC_CHANNEL_ID -n $CC_NAME -v $CC_VERSION --sequence $CC2_SEQUENCE  $CC2_INIT_REQUIRED    --waitForEvent --tls --cafile ../peers/peer2-harvx-grainchain-io/tls-msp/tlscacerts/tls-0-0-0-0-7052.pem



peer chaincode invoke  -C $CC_CHANNEL_ID -n $CC_NAME -c $CC_CONSTRUCTOR --waitForEvent --isInit -o $ORDERER_ADDRESS --tls --cafile ../peers/peer1-harvx-grainchain-io/tls-msp/tlscacerts/tls-0-0-0-0-7052.pem

peer chaincode invoke -C $CC_CHANNEL_ID -n $CC_NAME  -c '{"Args":["addTruck","002","DINA","MODELA43","2022","BLUE"]}' --tls --cafile ../peers/peer1-harvx-grainchain-io/tls-msp/tlscacerts/tls-0-0-0-0-7052.pem


peer chaincode query -C $CC_CHANNEL_ID -n $CC_NAME  -c '{"Args":["getTruck","002"]}' 
====================
3. Budget Peer Setup
====================
Log into the budget peer:
kubectl exec -it budget-peer-0 sh

Setup the peer:
> ./fetch-channel-block.sh
> ./join-channel.sh

Validate the peer:
./cc-test.sh install
./cc-test.sh query      # This should show the same value for a on both peers