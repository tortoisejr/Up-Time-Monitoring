/*
    Title: handle route file;
    Description:help to return respons according to routes;
    Author: Md Sabbir Sikder;
    Date: 15-06-2026
*/

// dependences
const { aboutHandler } = require('./haldlers/routeHandlers/aboutHandler');
const { userHandler } = require('./haldlers/routeHandlers/userHandler');
const { tokenHandler } = require('./haldlers/routeHandlers/tokenHandler');
const { checkHandler } = require('./haldlers/routeHandlers/checkHandler');

const routes = {
    about: aboutHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler,
};

module.exports = routes;
