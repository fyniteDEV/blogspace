const fs = require("fs");
const crypto = require("crypto");

const genKeypair = () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
      });

      fs.writeFileSync(__dirname + "/../config/private.pem", privateKey, "utf-8");
      fs.writeFileSync(__dirname + "/../config/public.pem", publicKey, "utf-8");

      console.log("New private and public keypair successfully generated");
}

genKeypair();