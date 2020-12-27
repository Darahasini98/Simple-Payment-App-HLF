const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const chaincodeName = 'spa';
const channelName = 'mychannel';
const { FileSystemWallet, Gateway,Wallets } = require('fabric-network');
const fabricNetwork = require('./fabricNetwork');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

async function Transfer(userName,benId,remId,amt) {

    // Create a new file system based wallet for managing identities.
     const walletPath = path.join(__dirname,'wallet');
    // console.log(`walletPath: ${walletPath}`);
    // const wallet = new FileSystemWallet(walletPath);

    const wallet = await buildWallet(Wallets, walletPath);
    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();
    let response;

     try {
        //Load connection profile; will be used to locate a gateway
        const userOrg = 'general';
        let orgDomain = `${userOrg}.parttracer.com`;
        let connectionFile = `connection-${userOrg}.yaml`;
        let connectionProfilePath = path.join(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'hdfc.example.com', 'connection-hdfc.json');

        // console.log(`connectionProfilePath: ${connectionProfilePath}`);
         let connectionProfile = yaml.safeLoad(fs.readFileSync(connectionProfilePath, 'utf8'));
        // console.log(`connectionProfile: ${connectionProfile}`);

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access myChannel network
       

        //const network = await gateway.getNetwork(netwrk);
        let listener;
        console.log('Use org.partTracer.partTrade smart contract.');

        const network = await gateway.getNetwork(channelName);
        console.log(`Use network channel: ${network}`);

        const contract =  network.getContract(chaincodeName);

        // addPart
        console.log('Submit partTrade addPart transaction.');

        // const crt = await fabricNetwork.connectNetwork(connection,WalletOrg)

        const addResponse = await contract.submitTransaction('Transfer', benId,remId,amt);

        // first create a listener to be notified of chaincode code events
      // coming from the chaincode ID "events"
    //   listener = async (event) => {
    //     // The payload of the chaincode event is the value place there by the
    //     // chaincode. Notice it is a byte data and the application will have
    //     // to know how to deserialize.
    //     // In this case we know that the chaincode will always place the asset
    //     // being worked with as the payload for all events produced.
    //     const asset = JSON.parse(event.payload.toString());
    //     console.log(
    //       `${GREEN}<-- Contract Event Received: ${
    //         event.eventName
    //       } - ${JSON.stringify(asset)}${RESET}`
    //     );
    //     // show the information available with the event
    //     console.log(`*** Event: ${event.eventName}:${asset.ID}`);
    //     // notice how we have access to the transaction information that produced this chaincode event
    //     const eventTransaction = event.getTransactionEvent();
    //     console.log(
    //       `*** transaction: ${eventTransaction.transactionId} status:${eventTransaction.status}`
    //     );
    //     showTransactionData(eventTransaction.transactionData);
    //     // notice how we have access to the full block that contains this transaction
    //     const eventBlock = eventTransaction.getBlockEvent();
    //     console.log(`*** block: ${eventBlock.blockNumber.toString()}`);
    //   };
    //   // now start the client side event service and register the listener
    //   console.log(
    //     `${GREEN}--> Start contract event stream to peer in Org1${RESET}`
    //   );
    //   await contract1Org1.addContractListener(listener);
    // } catch (eventError) {
    //   console.log(
    //     `${RED}<-- Failed: Setup contract events - ${eventError}${RESET}`
    //   );
    // }

        // process response
        console.log('Process addPart transaction response.'+addResponse);

        let accountId = addResponse.toString();

        console.log(`Part ${accountId} was added successfully`);
        console.log('Transaction complete.');
        response = { success: true, message: `Part ${accountId} was added successfully`};
        
    } catch (error) {
        
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

        response = { success: false, status:500, message: `Error processing transaction. ${error}`};
        
        if(error.endorsements && error.endorsements.length > 0){
            console.log(`Error processing transaction. ${error.endorsements[0]}`);
            response = { success: false, status:500, message: `Error processing transaction. ${error.endorsements[0]}`};
        }
    } finally {
        
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
        
        return response;
    }
}

 //let partDetails = [process.argv[2],'engine','Two seater premium plane engine','200000','General Electric']
 //let userDetails = ['6','4','200']

//Transfer('appUser',userDetails);

module.exports = Transfer;
