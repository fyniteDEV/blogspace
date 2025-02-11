const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync(__dirname + "/../config/private.pem", "utf8");

const generatePassword = (password) => {
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

    return { salt, hash };
}

const validatePassword = (hash, salt, password) => {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
    return hash === verifyHash;
}

const issueJWT = (user) => {    
    const uuid = user.uuid;
    const expiresIn = "14d";

    const payload = {
        sub: uuid,
        iat: Date.now()
    };
    
    return jwt.sign(payload, privateKey, { 
        expiresIn: expiresIn,
        algorithm: "RS256" 
    });
}

module.exports = {
    generatePassword,
    validatePassword,
    issueJWT
};