/*
    Title: Check Handler;
    Description:this file provide response for ./check route according to request method ;
    Author: Md Sabbir Sikder;
    Date: 19-06-2026
*/

// dependences
const data = require('../../lib/data');
// const { hash } = require('../../helper/utility');
const { JSONParse, tokenAuth, tokenCreator } = require('../../helper/utility');
// const { tokenCreator } = require('../../helper/utility');
// scaffolder
const handler = {};

handler.checkHandler = (reqProperty, callback) => {
    const methods = ['post', 'get', 'delete', 'put'];
    if (methods.indexOf(reqProperty.method) > -1) {
        handler.check[reqProperty.method](reqProperty, callback);
    } else {
        callback(400, { message: 'mathod sarvice is not avaiale' });
    }
};

handler.check = {};

// for post request
handler.check.post = (requestProperty, callback) => {
    const protocol =
        typeof requestProperty.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperty.body.protocol.trim()) > -1
            ? requestProperty.body.protocol
            : false;
    const url =
        typeof requestProperty.body.url === 'string' && requestProperty.body.url.trim().length > 0
            ? requestProperty.body.url
            : false;
    const method =
        typeof requestProperty.body.method === 'string' &&
        ['POST', 'GET', 'PUT', 'DELETE'].indexOf(requestProperty.body.method.trim()) > -1
            ? requestProperty.body.method
            : false;
    const successCode =
        typeof requestProperty.body.successCode === 'object' &&
        Array.isArray(requestProperty.body.successCode) &&
        requestProperty.body.successCode[0]
            ? requestProperty.body.successCode
            : false;
    const timeoutSeconds =
        typeof requestProperty.body.timeoutSeconds === 'number' &&
        requestProperty.body.timeoutSeconds % 1 === 0 &&
        requestProperty.body.timeoutSeconds >= 1 &&
        requestProperty.body.timeoutSeconds <= 5
            ? requestProperty.body.timeoutSeconds
            : false;
    const token =
        typeof requestProperty.headersObject.token === 'string' &&
        requestProperty.headersObject.token.trim().length === 20
            ? requestProperty.headersObject.token
            : false;

    if (protocol && url && method && successCode && timeoutSeconds) {
        if (token) {
            data.readfile('tokens', token, (err1, tokenData) => {
                if (!err1 && tokenData) {
                    const tokenObject = JSONParse(tokenData);
                    const { phone } = tokenObject;
                    data.readfile('users', phone, (err2, userData) => {
                        if (!err2 && userData) {
                            tokenAuth(token, phone, (isValid) => {
                                if (isValid) {
                                    const userObject = JSONParse(userData);
                                    const userChecks =
                                        Array.isArray(userObject.checks) &&
                                        typeof userObject.checks === 'object'
                                            ? userObject.checks
                                            : [];
                                    if (userChecks.length <= 5) {
                                        const checkId = tokenCreator(20);
                                        const checkObject = {
                                            id: checkId,
                                            phone,
                                            protocol,
                                            url,
                                            method,
                                            successCode,
                                            timeoutSeconds,
                                        };
                                        data.createfile('checks', checkId, checkObject, (err3) => {
                                            if (!err3) {
                                                userObject.checks = userChecks;
                                                userObject.checks.push(checkId);
                                                data.updatefile(
                                                    'users',
                                                    phone,
                                                    userObject,
                                                    (err4) => {
                                                        if (!err4) {
                                                            callback(200, checkObject);
                                                        } else {
                                                            callback(500, {
                                                                message: 'Server error',
                                                            });
                                                        }
                                                    }
                                                );
                                            } else {
                                                callback(500, { message: 'Server side Error' });
                                            }
                                        });
                                    } else {
                                        callback(401, {
                                            message: 'Number of checks is out of limit',
                                        });
                                    }
                                } else {
                                    callback(403, { message: 'Authentication Error' });
                                }
                            });
                        } else {
                            callback(404, { message: 'User not found' });
                        }
                    });
                } else {
                    callback(403, { message: 'Invalid Token' });
                }
            });
        } else {
            callback(403, { message: 'Invalid Token' });
        }
    } else {
        callback(400, { message: 'bad request for Insertion' });
    }
};

// for get request
handler.check.get = (requestProperty, callback) => {
    const checkId =
        typeof requestProperty.queryStringObject.id === 'string' &&
        requestProperty.queryStringObject.id.trim().length === 20
            ? requestProperty.queryStringObject.id
            : false;
    if (checkId) {
        data.readfile('checks', checkId, (err1, checkData) => {
            if (!err1 && checkData) {
                const token =
                    typeof requestProperty.headersObject.token === 'string' &&
                    requestProperty.headersObject.token.trim().length === 20
                        ? requestProperty.headersObject.token
                        : false;
                if (token) {
                    const checkObject = JSONParse(checkData);
                    const { phone } = checkObject;
                    tokenAuth(token, phone, (isValid) => {
                        if (isValid) {
                            callback(200, checkObject);
                        } else {
                            callback(403, { message: 'Authentication Error' });
                        }
                    });
                } else {
                    callback(400, { message: 'wrong token format' });
                }
            } else {
                callback(404, { message: 'check is not Found' });
            }
        });
    } else {
        callback(400, { message: 'wrong checkId format' });
    }
};

// for put request
handler.check.put = (requestProperty, callback) => {
    const checkId =
        typeof requestProperty.body.id === 'string' && requestProperty.body.id.trim().length === 20
            ? requestProperty.body.id
            : false;
    const protocol =
        typeof requestProperty.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperty.body.protocol.trim()) > -1
            ? requestProperty.body.protocol
            : false;
    const url =
        typeof requestProperty.body.url === 'string' && requestProperty.body.url.trim().length > 0
            ? requestProperty.body.url
            : false;
    const method =
        typeof requestProperty.body.method === 'string' &&
        ['POST', 'GET', 'PUT', 'DELETE'].indexOf(requestProperty.body.method.trim()) > -1
            ? requestProperty.body.method
            : false;
    const successCode =
        typeof requestProperty.body.successCode === 'object' &&
        Array.isArray(requestProperty.body.successCode) &&
        requestProperty.body.successCode[0]
            ? requestProperty.body.successCode
            : false;
    const timeoutSeconds =
        typeof requestProperty.body.timeoutSeconds === 'number' &&
        requestProperty.body.timeoutSeconds % 1 === 0 &&
        requestProperty.body.timeoutSeconds >= 1 &&
        requestProperty.body.timeoutSeconds <= 5
            ? requestProperty.body.timeoutSeconds
            : false;
    if (checkId) {
        if (protocol || url || method || successCode || timeoutSeconds) {
            data.readfile('checks', checkId, (err1, checkData) => {
                if (!err1 && checkData) {
                    const token =
                        typeof requestProperty.headersObject.token === 'string' &&
                        requestProperty.headersObject.token.trim().length === 20
                            ? requestProperty.headersObject.token
                            : false;
                    if (token) {
                        const checkObject = JSONParse(checkData);
                        const { phone } = checkObject;
                        tokenAuth(token, phone, (isvalid) => {
                            if (isvalid) {
                                if (protocol) {
                                    checkObject.protocol = protocol;
                                }
                                if (url) {
                                    checkObject.url = url;
                                }
                                if (method) {
                                    checkObject.method = method;
                                }
                                if (successCode) {
                                    checkObject.successCode = successCode;
                                }
                                if (timeoutSeconds) {
                                    checkObject.timeoutSeconds = timeoutSeconds;
                                }
                                data.updatefile('checks', checkId, checkObject, (err2) => {
                                    if (!err2) {
                                        callback(200, { message: 'sucessfully updated' });
                                    } else {
                                        callback(500, {
                                            message: 'server error to update the value',
                                        });
                                    }
                                });
                            } else {
                                callback(403, { message: 'Authentication error' });
                            }
                        });
                    } else {
                        callback(400, { message: 'wrong token input format' });
                    }
                } else {
                    callback(404, { message: 'checkId is not found' });
                }
            });
        }
    } else {
        callback(400, { message: 'wrong input format for id' });
    }
};

// for delete request
handler.check.delete = (requestProperty, callback) => {
    const checkId =
        typeof requestProperty.queryStringObject.id === 'string' &&
        requestProperty.queryStringObject.id.trim().length === 20
            ? requestProperty.queryStringObject.id
            : false;
    if (checkId) {
        data.readfile('checks', checkId, (err1, checkData) => {
            if (!err1 && checkData) {
                const token =
                    typeof requestProperty.headersObject.token === 'string' &&
                    requestProperty.headersObject.token.trim().length === 20
                        ? requestProperty.headersObject.token
                        : false;
                if (token) {
                    const checkObject = JSONParse(checkData);
                    const { phone } = checkObject;
                    tokenAuth(token, phone, (isValid) => {
                        if (isValid) {
                            data.deletefile('checks', checkId, (err2) => {
                                if (!err2) {
                                    data.readfile('users', phone, (err3, userData) => {
                                        if (!err3 && userData) {
                                            const userObject = JSONParse(userData);
                                            const userChecks = userObject.checks;
                                            const checkIndex = userChecks.indexOf(checkId);
                                            if (checkIndex > -1) {
                                                userChecks.splice(checkIndex, 1);
                                                userObject.checks = userChecks;
                                                data.updatefile(
                                                    'users',
                                                    phone,
                                                    userObject,
                                                    (err4) => {
                                                        if (!err4) {
                                                            callback(200, {
                                                                message:
                                                                    'Check deleted successfully',
                                                            });
                                                        } else {
                                                            callback(
                                                                (400,
                                                                {
                                                                    message:
                                                                        'user not updated because of server side Error',
                                                                })
                                                            );
                                                        }
                                                    }
                                                );
                                            } else {
                                                callback(404, {
                                                    message: 'check is not found in user checks',
                                                });
                                            }
                                        } else {
                                            callback(404, { message: 'user not found' });
                                        }
                                    });
                                } else {
                                    callback(500, { message: 'server unable to delete check' });
                                }
                            });
                        } else {
                            callback(403, { message: 'Authantication Error' });
                        }
                    });
                } else {
                    callback(400, { message: 'wrong Input of token format' });
                }
            } else {
                callback(404, { message: 'checkId is not found' });
            }
        });
    } else {
        callback(400, { message: 'Id foemat is wrong' });
    }
};

module.exports = handler;
