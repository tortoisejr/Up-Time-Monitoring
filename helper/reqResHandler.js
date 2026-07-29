/*
    Title:Response, Response Handler;
    Description: handle Response agains Request;
    Author: Md Sabbir Sikder;
    Date: 15-06-2026
*/

// dependeces
const url = require('url');
const { StringDecoder } = require('string_decoder');
const route = require('../routes');
const { notFoundHandler } = require('../haldlers/routeHandlers/notFoundHandler');
const { JSONParse } = require('./utility');
// Scaffolder
const handler = {};

handler.reqResHandler = (req, res) => {
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parseUrl.query;
    const headersObject = req.headers;

    const requestProperty = {
        parseUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };

    const selectedHandler = route[trimmedPath] ? route[trimmedPath] : notFoundHandler;

    // for reading data from POST request
    const decoder = new StringDecoder('utf-8');
    let realData = '';

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });
    req.on('end', () => {
        realData += decoder.end();
        requestProperty.body = JSONParse(realData);
        selectedHandler(requestProperty, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};

module.exports = handler;
