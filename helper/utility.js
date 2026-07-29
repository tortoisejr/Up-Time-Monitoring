/*
    Title:utilitis function;
    Description: hold all utility function for different work;
    Author: Md Sabbir Sikder;
    Date: 19-06-2026
*/

// dependences
const crypto = require('crypto');
const data = require('../lib/data');

// sacffolding
const utility = {};

utility.JSONParse = (JSONString) => {
    let output = {};
    try {
        output = JSON.parse(JSONString);
        return output;
    } catch {
        return output;
    }
};

utility.hash = (stringPassword) => {
    if (typeof stringPassword === 'string' && stringPassword.trim().length > 0) {
        const hashPassword = crypto
            .createHmac('sha256', 'sabbirSikder')
            .update(stringPassword)
            .digest('hex');
        return hashPassword;
    }
    return false;
};

utility.tokenCreator = (strLength) => {
    const Length = typeof strLength === 'number' && strLength ? strLength : false;
    let token = '';
    if (Length) {
        const potentialChar = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 1; i <= Length; i += 1) {
            const randomChar = potentialChar.charAt(
                Math.floor(Math.random() * potentialChar.length)
            );
            token += randomChar;
        }
        return token;
    }
    return token;
};

utility.tokenAuth = (tokenId, phoneNumber, callback) => {
    const token = typeof tokenId === 'string' && tokenId.trim().length === 20 ? tokenId : false;

    const phone =
        typeof phoneNumber === 'string' && phoneNumber.trim().length === 11 ? phoneNumber : false;

    if (token && phone) {
        data.readfile('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                const tokenDataObject = utility.JSONParse(tokenData);
                if (tokenDataObject.phone === phone && tokenDataObject.expires > Date.now()) {
                    callback(true);
                } else {
                    callback(false);
                }
            } else {
                callback(false);
            }
        });
    } else {
        callback(false);
    }
};

module.exports = utility;
