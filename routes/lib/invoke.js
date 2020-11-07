/*
 * SPDX-License-Identifier: Apache-2.0
 */

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
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } }); // asLocalhost should be disabled when deploy. 

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('byobl');
        console.log(args);

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        if( fcn == "registerVC" )
            await contract.submitTransaction('registerVC', args.key, args.conDID, args.claimDef, args.sig, args.sigType, args.expired);
        else if( fcn == "registerDDo" )
            await contract.submitTransaction('registerDID', args.key, args.pubkey, args.pubkeyType, args.context, args.sType, args.sEndpoint); // Transaction name should be updated!
        else if (fcn == "removeDDo") {
            await contract.submitTransaction('removeDDo', args);
            console.log("Delete Success.");
        }
         
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

module.exports = invoke;
