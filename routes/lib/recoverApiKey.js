const FileSystemWallet = require('fabric-network');
const uuidAPIKey = require("uuid-apikey");
const path = require('path');

async function recoverApiKey(args){
    const domain = args.domain;
    const user = `${args.user}.${domain}`;
    const uuid = args.uuid;

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const userExists = await wallet.exists(user);
    if(!userExists) {
        console.log(`An identity for the user ${user} does not exist in the wallet`);
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    if(!uuidAPIKey.isUUID(uuid)){ 
        console.log(`The UUID(${uuid}) is invalid. Please UUID check again.`)
        return;
    }

    console.log('Successfully Recover APIKey')

    return uuidAPIKey.toAPIKey(uuid);
}

module.exports = recoverApiKey;