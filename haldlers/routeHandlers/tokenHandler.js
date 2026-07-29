/*
    Title: token response;
    Description:this file provide response for ./token route according to request method ;
    Author: Md Sabbir Sikder;
    Date: 19-06-2026
*/

// dependences
const data = require('../../lib/data');
const { hash } = require('../../helper/utility');
const { JSONParse } = require('../../helper/utility');
const { tokenCreator } = require('../../helper/utility');
// scaffolder
const handler = {};

handler.tokenHandler = (reqProperty, callback) => {
    const methods = ['post', 'get', 'delete', 'put'];
    if (methods.indexOf(reqProperty.method) > -1) {
        handler.token[reqProperty.method](reqProperty, callback);
    } else {
        callback(400, { message: 'mathod sarvice is not avaiale' });
    }
};

handler.token = {};

// for post request
handler.token.post = (requestProperty, callback) => {
    const phone =
        typeof requestProperty.body.phone === 'string' &&
        requestProperty.body.phone.trim().length === 11
            ? requestProperty.body.phone
            : false;
    const password =
        typeof requestProperty.body.password === 'string' &&
        requestProperty.body.password.trim().length > 0
            ? requestProperty.body.password
            : false;

    if (phone && password) {
        data.readfile('users', phone, (err1, udata) => {
            if (!err1 && udata) {
                const userData = JSONParse(udata);
                const hashedPassword = hash(password);
                if (userData.password === hashedPassword) {
                    const token = tokenCreator(20);
                    const expires = Date.now() + 60 * 60 * 1000;
                    const tokenObject = {
                        id: token,
                        phone,
                        expires,
                    };
                    data.createfile('tokens', token, tokenObject, (err2) => {
                        if (!err2) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, { message: 'file is not created' });
                        }
                    });
                } else {
                    callback(400, { message: 'password is wrong' });
                }
            } else {
                callback(404, { message: 'user is not found' });
            }
        });
    } else {
        callback(400, { ton: requestProperty.body });
    }
};

// for get request
handler.token.get = (requestProperty, callback) => {
    const token =
        typeof requestProperty.queryStringObject.id === 'string' &&
        requestProperty.queryStringObject.id.trim().length === 20
            ? requestProperty.queryStringObject.id
            : false;
    if (token) {
        data.readfile('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                const tokenDataObjec = JSONParse(tokenData);
                callback(200, tokenDataObjec);
            } else {
                callback(404, { message: 'token is not found' });
            }
        });
    } else {
        callback(400, { message: 'wrong token' });
    }
};

// for put request
handler.token.put = (requestProperty, callback) => {
    const token =
        typeof requestProperty.body.id === 'string' && requestProperty.body.id.trim().length === 20
            ? requestProperty.body.id
            : false;
    const expend =
        typeof requestProperty.body.expend === 'boolean' && requestProperty.body.expend
            ? requestProperty.body.expend
            : false;

    if (token && expend) {
        data.readfile('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                const tokenObject = JSONParse(tokenData);
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                data.updatefile('tokens', token, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, { message: 'Token update is successful' });
                    } else {
                        callback(400, { message: 'Error is server' });
                    }
                });
            } else {
                callback(404, { message: 'token not found' });
            }
        });
    } else {
        callback(400, { message: 'wrong input' });
    }
};

// for delete request

handler.token.delete = (requestProperty, callback) => {
    const token =
        typeof requestProperty.queryStringObject.id === 'string' &&
        requestProperty.queryStringObject.id.trim().length === 20
            ? requestProperty.queryStringObject.id
            : false;

    if (token) {
        data.readfile('tokens', token, (err1) => {
            if (!err1) {
                data.deletefile('tokens', token, (err2) => {
                    if (!err2) {
                        callback(200, { message: 'Token is deleted successfully' });
                    } else {
                        callback(500, { message: 'There is a problem is server to delete' });
                    }
                });
            } else {
                callback(404, { message: 'Token not found' });
            }
        });
    }
};

module.exports = handler;
