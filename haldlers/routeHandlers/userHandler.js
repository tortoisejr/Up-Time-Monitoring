/*
    Title: user response;
    Description:this file provide response for ./user route according to request method ;
    Author: Md Sabbir Sikder;
    Date: 19-06-2026
*/

// dependences
const data = require('../../lib/data');
const { hash } = require('../../helper/utility');
const { JSONParse, tokenAuth } = require('../../helper/utility');
// scaffolder
const handler = {};

handler.userHandler = (reqProperty, callback) => {
    const methods = ['post', 'get', 'delete', 'put'];
    if (methods.indexOf(reqProperty.method) > -1) {
        handler.user[reqProperty.method](reqProperty, callback);
    } else {
        callback(400, { message: 'Bad Request' });
    }
};

handler.user = {};

// for post request
handler.user.post = (reqProperty, callback) => {
    const firstName =
        typeof reqProperty.body.firstName === 'string' &&
        reqProperty.body.firstName.trim().length > 0
            ? reqProperty.body.firstName
            : false;

    const lastName =
        typeof reqProperty.body.lastName === 'string' && reqProperty.body.lastName.trim().length > 0
            ? reqProperty.body.lastName
            : false;

    const phone =
        typeof reqProperty.body.phone === 'string' && reqProperty.body.phone.trim().length === 11
            ? reqProperty.body.phone
            : false;

    const password =
        typeof reqProperty.body.password === 'string' && reqProperty.body.password.trim().length > 0
            ? reqProperty.body.password
            : false;

    const tosAgreement =
        typeof reqProperty.body.tosAgreement === 'boolean' && reqProperty.body.tosAgreement
            ? reqProperty.body.tosAgreement
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        const userData = {
            firstName,
            lastName,
            phone,
            password: hash(password),
            tosAgreement,
        };
        data.readfile('users', phone, (err) => {
            if (err) {
                data.createfile('users', phone, userData, (err2) => {
                    if (!err2) {
                        callback(200, { message: 'user is created successfully' });
                    } else {
                        callback(500, { message: 'there is a server site error to  create user' });
                    }
                });
            } else {
                callback(500, { message: 'This number is already registered' });
            }
        });
    } else {
        callback(400, { message: 'Bad request for your insertion' });
    }
};

// for get request
handler.user.get = (requestProperty, callback) => {
    const phone =
        typeof requestProperty.queryStringObject.phone === 'string' &&
        requestProperty.queryStringObject.phone.trim().length === 11
            ? requestProperty.queryStringObject.phone
            : false;
    const token =
        typeof requestProperty.headersObject.token === 'string' &&
        requestProperty.headersObject.token.trim().length === 20
            ? requestProperty.headersObject.token
            : false;
    if (phone) {
        if (token) {
            data.readfile('users', phone, (err1, userData) => {
                if (err1) {
                    callback(404, { message: 'User Not Found' });
                } else {
                    tokenAuth(token, phone, (result) => {
                        if (result) {
                            const userJson = JSONParse(userData);
                            delete userJson.password;
                            callback(200, userJson);
                        } else {
                            callback(403, { message: 'Authentication Error' });
                        }
                    });
                }
            });
        } else {
            callback(403, { message: 'Authentication Error' });
        }
    } else {
        callback(400, { message: 'Bad Request. wrong insertion of number' });
    }
};

// for put request
handler.user.put = (requestProperty, callback) => {
    const token =
        typeof requestProperty.headersObject.token === 'string' &&
        requestProperty.headersObject.token.trim().length === 20
            ? requestProperty.headersObject.token
            : false;
    const phone =
        typeof requestProperty.body.phone === 'string' &&
        requestProperty.body.phone.trim().length === 11
            ? requestProperty.body.phone
            : false;

    // check field for update
    const firstName =
        typeof requestProperty.body.firstName === 'string' &&
        requestProperty.body.firstName.trim().length > 0
            ? requestProperty.body.firstName
            : false;

    const lastName =
        typeof requestProperty.body.lastName === 'string' &&
        requestProperty.body.lastName.trim().length > 0
            ? requestProperty.body.lastName
            : false;

    const password =
        typeof requestProperty.body.password === 'string' &&
        requestProperty.body.password.trim().length > 0
            ? requestProperty.body.password
            : false;

    if (phone) {
        // authentication check
        if (token) {
            tokenAuth(token, phone, (result) => {
                if (result) {
                    if (firstName || lastName || password) {
                        data.readfile('users', phone, (err1, userData) => {
                            if (err1) {
                                callback(404, { message: 'User Not Found' });
                            } else {
                                const userJson = JSONParse(userData);
                                if (firstName) {
                                    userJson.firstName = firstName;
                                }
                                if (lastName) {
                                    userJson.lastName = lastName;
                                }
                                if (password) {
                                    userJson.password = hash(password);
                                }
                                data.updatefile('users', phone, userJson, (err2) => {
                                    if (!err2) {
                                        callback(200, { message: 'User update successfully' });
                                    } else {
                                        callback(500, { message: 'Server side error' });
                                    }
                                });
                            }
                        });
                    } else {
                        callback(400, { message: 'Bad request for your field insertion' });
                    }
                } else {
                    callback(403, { message: 'Authentication Error' });
                }
            });
        } else {
            callback(403, { message: 'Authentication Error' });
        }
    } else {
        callback(400, { message: 'Bad request for your phone' });
    }
};

// for delete request

handler.user.delete = (requestProperty, callback) => {
    const token =
        typeof requestProperty.headersObject.token === 'string' &&
        requestProperty.headersObject.token.trim().length === 20
            ? requestProperty.headersObject.token
            : false;
    const phone =
        typeof requestProperty.queryStringObject.phone === 'string' &&
        requestProperty.queryStringObject.phone.trim().length === 11
            ? requestProperty.queryStringObject.phone
            : false;

    if (phone) {
        if (token) {
            tokenAuth(token, phone, (result) => {
                if (result) {
                    data.readfile('users', phone, (err1) => {
                        if (!err1) {
                            data.deletefile('users', phone, (err2) => {
                                if (!err2) {
                                    callback(200, { message: 'User successfully deleted' });
                                } else {
                                    callback(500, { message: 'server Error' });
                                }
                            });
                        } else {
                            callback(404, { message: 'User not found' });
                        }
                    });
                } else {
                    callback(403, { message: 'Authentication Error' });
                }
            });
        } else {
            callback(400, { message: 'Insert wrong token' });
        }
    } else {
        callback(400, { message: 'Bad request for phone' });
    }
};

module.exports = handler;
