


#Clean the environment 
kubectl delete deploy --all 
kubectl delete pvc --all &
kubectl delete pv --all &

#DEPLOY tools pod
kubectl apply -f /home/kubernetes/toolsOrg/

#CREATE CHANNEL TX AND GENESIS BLOCK

## Apply all the yamls files for svc, pv, pvc and deployments for Orderers
kubectl apply -f /home/kubernetes/orderersOrg/orderer1/
kubectl apply -f /home/kubernetes/orderersOrg/orderer2/
kubectl apply -f /home/kubernetes/orderersOrg/orderer3/
kubectl apply -f /home/kubernetes/orderersOrg/orderer4/
kubectl apply -f /home/kubernetes/orderersOrg/orderer5/

## Apply all yamls for harvx 
kubectl apply -f /home/kubernetes/org1Peers/org1peer0/
kubectl apply -f /home/kubernetes/org1Peers/org1peer1/

##Apply all yamls for commodity
kubectl apply -f /home/kubernetes/org2Peers/org2peer0/
kubectl apply -f /home/kubernetes/org2Peers/org2peer1/

### FIX /etc/hosts
 #kubectl get svc/commoditypeer0 -o custom-columns=NAME:.spec.clusterIP ---> get each svc ip address