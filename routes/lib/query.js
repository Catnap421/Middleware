/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const logger = require(process.cwd()+'/config/winston');
const ccpPath = path.resolve('./config',  'connection-org1.json');

async function query(fcn, user, domain, args, apikey) {
    try {
        const jsonFile = fs.readFileSync('./apikey.json', 'utf8');
        const jsonData = JSON.parse(jsonFile);

        if(jsonData[domain][user].apikey == apikey) {
            jsonData[domain][user].count++;
            try {
                fs.writeFileSync("./apikey.json", JSON.stringify(jsonData));
            } catch (error) {
                if(error) throw error;  
            }
        }
        else {
            console.log(jsonData[domain][user].apikey);
            console.log(apikey);
            console.log('Invalid User!!')
            return;
        }
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet'); // routing 나중에 해주기
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userWithDomain = `${user}.${domain}`;
        const userExists = await wallet.exists(userWithDomain);
        if (!userExists) {
            console.log(`An identity for the user ${userWithDomain} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: userWithDomain, discovery: { enabled: true, asLocalhost: true } });
        
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        
        // Get the contract from the network.
        const contract = network.getContract('byobl');
        
        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        let result;
        if( fcn == "queryAllCars")
            result = await contract.evaluateTransaction('queryAllCars');
        else if( fcn == "queryDDo" )
            result = await contract.evaluateTransaction('queryDDo', args);
        else if( fcn == "queryVC" )
            result = await contract.evaluateTransaction('queryVC', args);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}
// query("queryDDo", "sample")
module.exports = query
