/*
 * Title: Notifications Library
 * Description: Important functions to notify users
 * Author: Sumit Saha ( Learn with Sumit )
 * Updated: 2026
 */

// dependencies
const https = require('https');
const querystring = require('querystring');
const { twilio } = require('./environments');

// module scaffolding
const notifications = {};

// send sms to user using twilio api
notifications.sendTwilioSms = (phone, msg, callback) => {
    // input validation
    const userPhone =
        typeof phone === 'string' && /^[0-9]{11}$/.test(phone.trim()) ? phone.trim() : false;

    const userMsg = typeof msg === 'string' && msg.trim().length > 0 ? msg.trim() : false;

    if (userPhone && userMsg) {
        // configure payload
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMsg,
        };

        // stringify payload
        const stringifiedPayload = querystring.stringify(payload);

        // configure request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringifiedPayload),
            },
        };

        // create request object
        const req = https.request(requestDetails, (res) => {
            let responseData = '';

            // collect response data
            res.on('data', (chunk) => {
                responseData += chunk;
            });

            // response finished
            res.on('end', () => {
                const status = res.statusCode;

                if (status >= 200 && status < 300) {
                    callback(false);
                } else {
                    callback(`Twilio returned status code ${status}. Response: ${responseData}`);
                }
            });
        });

        // timeout protection
        req.setTimeout(10000, () => {
            req.destroy();
            callback('Request timeout');
        });

        // request error
        req.on('error', (err) => {
            callback(err);
        });

        // send payload
        req.write(stringifiedPayload);
        req.end();
    } else {
        callback('Given parameters were missing or invalid!');
    }
};

// export module
module.exports = notifications;
