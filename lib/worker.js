/*
    Title: link Status checker;
    Description:check links status after a certain period , alert user and update database;
    Author: Md Sabbir Sikder;
    Date: 25-06-2026
*/

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const { JSONParse } = require('../helper/utility');
const data = require('./data');
const { sendTwilioSms } = require('../helper/notification');
// scaffolding object
const worker = {};

// function define

// gether all the checks
worker.getherAllChecks = () => {
    data.list('checks', (err1, checksFileName) => {
        if (!err1 && checksFileName && checksFileName.length > 0) {
            checksFileName.forEach((fileName) => {
                data.readfile('checks', fileName, (err2, checkData) => {
                    if (!err2 && checkData) {
                        worker.validationCheckData(checkData);
                    } else {
                        console.log('check data is not found');
                    }
                });
            });
        } else {
            console.log(`${err1}error is occuer to read the file name`);
        }
    });
};

// to call the getherAllchecks again and  again
worker.loop = () => {
    setInterval(() => {
        worker.getherAllChecks();
    }, 7000);
};

// to check the validation of the checkData require Properties

worker.validationCheckData = (checkData) => {
    const checkObject = JSONParse(checkData);
    const checkId = checkObject.id;
    if (checkObject && checkId) {
        checkObject.checkState =
            typeof checkObject.checkState === 'string' &&
            ['up', 'down'].indexOf(checkObject.checkState) > -1
                ? checkObject.checkState
                : 'down';
        checkObject.lastCheckedTime =
            typeof checkObject.lastCheckedTime === 'number' && checkObject.lastCheckedTime > 0
                ? checkObject.lastCheckedTime
                : false;

        worker.performcheck(checkObject);
    } else {
        console.log('checked Id is missing here');
    }
};

// to perform check so what is the response for the check
worker.performcheck = (checkObject) => {
    let flag = false;
    const checkResult = {
        err: false,
        statusCode: false,
    };
    const parsedUrl = url.parse(`${checkObject.protocol}://${checkObject.url}`);
    const requestDetails = {
        protocol: `${parsedUrl.protocol}`,
        hostname: parsedUrl.hostname,
        method: checkObject.method.toUpperCase(),
        path: parsedUrl.path,
        timeout: checkObject.timeoutSeconds * 1000,
    };

    const userProtocol = checkObject.protocol === 'https' ? https : http;
    const req = userProtocol.request(requestDetails, (res) => {
        if (!flag) {
            checkResult.statusCode = res.statusCode;
            flag = true;
            worker.processCheckResult(checkObject, checkResult);
        }
    });

    req.on('error', () => {
        if (!flag) {
            checkResult.err = 'Error happen';
            flag = true;
            worker.processCheckResult(checkObject, checkResult);
        }
    });

    req.on('timeout', () => {
        if (!flag) {
            checkResult.err = 'Timeout happen';
            flag = true;
            worker.processCheckResult(checkObject, checkResult);
        }
    });

    req.end();
};

// process the result that come from request and desite is the state is change or not
worker.processCheckResult = (checkObject, checkResult) => {
    // TODO remove
    const state =
        !checkResult.err &&
        checkResult.statusCode &&
        checkObject.successCode.indexOf(checkResult.statusCode) > -1
            ? 'up'
            : 'down';
    const isWantAlert = !!(checkObject.lastCheckedTime && state !== checkObject.checkState);
    checkObject.checkState = state;
    checkObject.lastCheckedTime = Date.now();
    data.updatefile('checks', checkObject.id, checkObject, (err) => {
        if (!err) {
            if (isWantAlert) {
                worker.alertUserToStateChange(checkObject);
            } else {
                console.log(
                    `for ${checkObject.method} method state of ${checkObject.url} url is unchanged`
                );
            }
        } else {
            console.log('there is a problem to update check after state change');
        }
    });
};

// to alert user about state change by SMS
worker.alertUserToStateChange = (checkObject) => {
    const msg = `Alert: Your check for ${checkObject.method.toUpperCase()} ${
        checkObject.protocol
    }://${checkObject.url} is currently ${checkObject.checkState}`;
    sendTwilioSms(checkObject.phone, msg, (err) => {
        if (!err) {
            console.log(`User was alerted to a status change via SMS: ${msg}`);
        } else {
            console.log('There was a problem sending sms to one of the user!', err);
        }
    });
    // console.log(msg);
};

worker.init = () => {
    worker.getherAllChecks();

    // for continue check
    worker.loop();
};

// call or export function
module.exports = worker;
