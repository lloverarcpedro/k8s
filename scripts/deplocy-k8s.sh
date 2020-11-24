

minikube start 

#Clean the environment 
kubectl delete deploy --all 
kubectl delete pvc --all &
kubectl delete pv --all &

minikube ssh
mkdir /nfs
mkdir /nfs/fabric
mkdir /nfs/config 
chmod 777 /nfs
chmod 777 /nfs/fabric
chmod 777 /nfs/config

#COPY Crypto-material to shared
cd /vagrant
scp -r -i $(minikube ssh-key) ca docker@192.168.49.2:/nfs/fabric
scp -r -i $(minikube ssh-key) channel-artifacts/* docker@192.168.49.2:/nfs/fabric/
scp -r -i $(minikube ssh-key) gopath docker@192.168.49.2:/nfs/fabric
#DEPLOY tools pod
kubectl apply -f toolsOrg/

#CREATE CHANNEL TX AND GENESIS BLOCK
export FABRIC_CFG_PATH=$PWD
configtxgen -profile OrgsOrdererGenesis -channelID ordererschannel -outputBlock ./genesis.block
configtxgen -profile OrgsChannel -outputCreateChannelTx ./channel.tx -channelID "grainchainchannel"

#UPDATE ANCHOR PEER
configtxgen -profile OrgsChannel -outputAnchorPeersUpdate ./harvxAnchors.tx  -channelID "grainchainchannel" -asOrg harvx
configtxgen -profile OrgsChannel -outputAnchorPeersUpdate ./commodityAnchors.tx  -channelID "grainchainchannel" -asOrg commodity

#Copy genesis and tx files to minikube
scp -r -i $(minikube ssh-key) channel-artifacts/* docker@192.168.49.2:/nfs/fabric/
scp -r -i $(minikube ssh-key) k8s/core.yaml docker@192.168.49.2:/nfs/fabric/config/core.yaml

## Apply all the yamls files for svc, pv, pvc and deployments for Orderers
kubectl apply -f orderersOrg/orderer1/
kubectl apply -f orderersOrg/orderer2/
kubectl apply -f orderersOrg/orderer3/
kubectl apply -f orderersOrg/orderer4/
kubectl apply -f orderersOrg/orderer5/

## Apply all yamls for harvx 
kubectl apply -f org1Peers/org1peer0/
kubectl apply -f org1Peers/org1peer1/

##Apply all yamls for commodity
kubectl apply -f org2Peers/org2peer0/
kubectl apply -f org2Peers/org2peer1/

### FIX /etc/hosts fetch svc ipaddresses
 #kubectl get svc/commoditypeer0 -o custom-columns=NAME:.spec.clusterIP ---> get each svc ip address

