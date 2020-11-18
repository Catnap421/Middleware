'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const logger = require(process.cwd()+'/config/winston');
const ccpPath = path.resolve('./config',  'connection-org1.json');

async function query(fcn, user, domain, args, apikey) {
    // API 사용량 측정
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
            logger.warn('Invalid User. The api-key is invalid');
            return {status:401};
        }
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet'); // routing 나중에 해주기
        const wallet = new FileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const userWithDomain = `${user}.${domain}`;
        const userExists = await wallet.exists(userWithDomain);
        if (!userExists) {
            logger.warn(`An identity for the user ${userWithDomain} does not exist in the wallet\nRun the registerUser.js application before retrying`)
            return {status: 401};
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: userWithDomain, discovery: { enabled: true, asLocalhost: true } });
        
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        
        // Get the contract from the network.
        const contract = network.getContract('sillock');
        
        // Evaluate the specified transaction.
        let result;
        if( fcn == "queryDDo" )
            result = await contract.evaluateTransaction('queryDDo', args);
        else if( fcn == "queryVC" )
            result = await contract.evaluateTransaction('queryDDo', args);

        logger.info(`Transaction has been evaluated, result is: ${result.toString()}`);

        return result;
    } catch (error) {
        logger.error(`Failed to evaluate transaction: ${error}`);
        return {status: 404};
    }
}

module.exports = query
