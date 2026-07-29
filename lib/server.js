/*
    Title: server Creation;
    Description: server will create in this file and catch the request from this file ;
    Author: Md Sabbir Sikder;
    Date: 25-06-2026
*/

// Dependencies
// const fs = require('fs');
const http = require('http');
const { reqResHandler: requestHandle } = require('../helper/reqResHandler');

// scaffoldin object
const server = {};

// configaration

server.config = {
    port: 3000,
};

// function define

server.init = () => {
    const newServer = http.createServer(requestHandle);
    newServer.listen(server.config.port);
};

// call or export function

module.exports = server;
