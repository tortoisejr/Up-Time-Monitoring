/*
 * Title: Environments
 * Description: Handle all environment related things
 * Author: sabbir
 * Date: 24/6/26
 *
 */

// dependencies

// module scaffolding
const environments = {};

// staging environment
environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'hsjdhsdhsjdhjshdjshd',
    maxChecks: 5,
    twilio: {
        fromPhone: '+19166555086',
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: '01709ce045a263c1d008048c3a5ff8c7',
    },
};

// production environment
environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'djkdjskdjksdjksjdskjd',
    maxChecks: 5,
    twilio: {
        fromPhone: '',
        accountSid: '',
        authToken: '',
    },
};

// determine which environment was passed
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

// export module
module.exports = environmentToExport;
