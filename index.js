/*
    Title: up time Monitoring index.js file;
    Description:Application will start from this file ;
    Author: Md Sabbir Sikder;
    Date: 15-06-2026
*/

// Dependencies
// const fs = require('fs');
const server = require('./lib/server');
const worker = require('./lib/worker');

// App object
const app = {};

// configaration

// function define

app.runProject = () => {
    server.init();
    worker.init();
};

// call or export function

app.runProject();
