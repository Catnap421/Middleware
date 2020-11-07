'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const logger = require(process.cwd()+'/config/winston');
const ccpPath = path.resolve('./config', 'connection-org1.json');

async function invoke(fcn, args) {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const adminExists = await wallet.exists('admin'); // invoke는 차피, 실록에서만 다룰거니까 유저가 필요한가?
        if (!adminExists) {
            logger.warn('An identity for the admin user "admin" does not exist in the wallet\nRun the enrollAdmin.js application before retrying')
            return {status: 401};
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } }); // asLocalhost should be disabled when deploy. 

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('byobl');
        logger.info(`invoke - ${args}`);

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        if( fcn == "registerVC" )
            await contract.submitTransaction('registerVC', args.key, args.conDID, args.claimDef, args.sig, args.sigType, args.expired);
        else if( fcn == "registerDDo" )
            await contract.submitTransaction('registerDID', args.key, args.pubkey, args.pubkeyType, args.context, args.sType, args.sEndpoint); // Transaction name should be updated!
        else if (fcn == "removeDDo") {
            await contract.submitTransaction('removeDDo', args);
            logger.info("Delete Success.");
        }

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        logger.error(`Failed to submit transaction: ${error}`);
        return {status: 400}
    }
}

module.exports = invoke;
