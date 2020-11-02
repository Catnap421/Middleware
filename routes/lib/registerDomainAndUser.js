'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const uuidAPIKey = require('uuid-apikey');

const ccpPath = path.resolve(__dirname, 'connection-org1.json');

function registerApiKey(args){
    const domain = args.domain;
    const uuidWithApiKey = uuidAPIKey.create();

    const jsonFile = fs.readFileSync('./apikey.json', 'utf8');
    const jsonData = JSON.parse(jsonFile);

    if(!jsonData[domain]) jsonData[domain] = {};

    jsonData[domain][args.user] = uuidWithApiKey.apiKey;

    try {
        fs.writeFileSync("./apikey.json", JSON.stringify(jsonData));
    } catch (error) {
        if(error) throw error;  
    }

    console.log(`Register Complete!\nUUID: ${uuidWithApiKey.uuid}, APIKey: ${uuidWithApiKey.apiKey}`);
}

async function register(args) { // user에 맞춰서 접근제어 기능 추후 추가
    try {
        const domain = args.domain;
        const user = `${args.user}.${domain}`;
        let org = args.org ? args.org : "org1";

        // Create a new file system based wallet for managing identities.
        let walletPath = path.join(process.cwd(), `wallet`);
        
        if(!fs.existsSync(walletPath)) fs.mkdirSync(walletPath);

        let wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
    
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(user);
        if (userExists) {
            console.log(`An identity for the user ${user} already exists in the wallet`);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: org+'.department1', enrollmentID: user, role: 'client' }, adminIdentity); // ***affiliation 추후 수정 필요 
        const enrollment = await ca.enroll({ enrollmentID: user, enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes()); // user + "Org1" 추후 수정 필요
        await wallet.import(user, userIdentity);
        console.log('Successfully registered and enrolled admin user and imported it into the wallet');

        // Register api-key for that user
        registerApiKey(args);
   

    } catch (error) {
        console.error(`Failed to register user ${args.user}: ${error}`);
        process.exit(1);
    }
}

module.exports = register;
