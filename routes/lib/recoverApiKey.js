const { FileSystemWallet } = require('fabric-network');
const uuidAPIKey = require("uuid-apikey");
const path = require('path');
const logger = require(process.cwd()+'/config/winston');

async function recoverApiKey(args){
    const domain = args.domain;
    const user = `${args.user}.${domain}`;
    const uuid = args.uuid;

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);

    const userExists = await wallet.exists(user);
    if(!userExists) {
        logger.warn(`An identity for the user ${user} does not exist in the wallet\nRun the registerUser.js application before retrying`)
        return {status: 401};
    }

    if(!uuidAPIKey.isUUID(uuid)){ 
        logger.warn('The UUID(${uuid}) is invalid. Please UUID check again.');
        return {status: 400};
    }
    logger.info('Successfully Recover APIKey');

    return uuidAPIKey.toAPIKey(uuid);
}

module.exports = recoverApiKey;