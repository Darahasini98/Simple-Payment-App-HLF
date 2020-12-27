const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const chaincodeName = 'spa';
const channelName = 'mychannel';
const { FileSystemWallet, Gateway,Wallets } = require('fabric-network');
const fabricNetwork = require('./fabricNetwork');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

async function GetAccountStatement(userName,args) {

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

        console.log('Use org.partTracer.partTrade smart contract.');

        const network = await gateway.getNetwork(channelName);
        console.log(`Use network channel: ${network}`);

        const contract =  network.getContract(chaincodeName);

        // addPart
        console.log('Submit partTrade addPart transaction.');

        // const crt = await fabricNetwork.connectNetwork(connection,WalletOrg)

        const addResponse = await contract.submitTransaction('GetAccountStatement',args[0]);

        // process response
        console.log('Process addPart transaction response.'+addResponse);

        let accounts = addResponse.toString();

        console.log(`Part ${accounts} was added successfully`);
        console.log('Transaction complete.');
        response = { success: true, message: `Part ${accounts} was added successfully`};
        
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
//  let userDetails = ['6','suma','SBI','20000.00','false']

// RegisterUserAccount('appUser',userDetails);

// let arg = ['4']
// Balance('appUser',arg);
module.exports = GetAccountStatement;
