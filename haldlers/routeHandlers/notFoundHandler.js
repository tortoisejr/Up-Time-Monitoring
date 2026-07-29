/*
    Title:Not Found Handler;
    Description: handle Response against a request that is not found;
    Author: Md Sabbir Sikder;
    Date: 15-06-2026
*/

// dependeces

// Scaffolder
const handler = {};

handler.notFoundHandler = (reqProperty, callBack) => {
    const urlPath = reqProperty.trimmedPath;
    const message = `Page is not Found ${urlPath}`;
    callBack(404, { message });
};

module.exports = handler;
