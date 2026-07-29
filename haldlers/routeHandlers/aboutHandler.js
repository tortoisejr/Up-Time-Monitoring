/*
    Title: about response;
    Description:this file provide response for ./about route ;
    Author: Md Sabbir Sikder;
    Date: 15-06-2026
*/

// dependences
// scaffolder
const handler = {};

handler.aboutHandler = (reqProperty, callBack) => {
    const urlPath = reqProperty.trimmedPath;
    const message = `message printed from ${urlPath}`;
    callBack(200, { message });
};

module.exports = handler;
