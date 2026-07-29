/*
    Title:File manipulation ;
    Description: file create,read,update and delete will be held here;
    Author: Md Sabbir Sikder;
    Date: 18-06-2026
*/

// dependences
const fs = require('fs');

// scaffolding
const lib = {};

lib.basedir = `${__dirname}/../.Data/`;

lib.createfile = (dir, file, data, callback) => {
    fs.open(`${`${lib.basedir + dir}/${file}`}.json`, 'wx', (err1, filedescriptor) => {
        if (!err1 && filedescriptor) {
            const stringData = JSON.stringify(data);
            fs.writeFile(filedescriptor, stringData, (err2) => {
                if (err2) {
                    console.log('file is unableavail for write', err2);
                } else {
                    fs.close(filedescriptor, (err3) => {
                        if (err3) {
                            console.log('there is a problem in file closeing', err3);
                            callback(true);
                        } else {
                            callback(false);
                        }
                    });
                }
            });
        } else {
            console.log('file is not create', err1);
        }
    });
};

lib.readfile = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        if (err) {
            console.log('Data is not possible to read', err);
            callback(true, {});
        } else {
            callback(false, data);
        }
    });
};

lib.updatefile = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err1, fileDescriptor) => {
        if (!err1 && fileDescriptor) {
            fs.ftruncate(fileDescriptor, (err2) => {
                if (err2) {
                    console.log('file is unable to truncate', err2);
                } else {
                    const stringData = JSON.stringify(data);
                    fs.writeFile(fileDescriptor, stringData, (err3) => {
                        if (err3) {
                            console.log('there is not possible to write data', err3);
                        } else {
                            fs.close(fileDescriptor, (err4) => {
                                if (err4) {
                                    console.log('file is not closing', err4);
                                    callback(true);
                                } else {
                                    callback(false);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            console.log('file is not open', err1);
        }
    });
};

lib.deletefile = (dir, file, callback) => {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (err) {
            console.log('file is not deleted', err);
            callback(true);
        } else {
            callback(false);
        }
    });
};

lib.list = (dir, callback) => {
    fs.readdir(`${lib.basedir + dir}/`, (err, files) => {
        if (!err && files) {
            const trimmedFileName = [];
            files.forEach((file) => {
                trimmedFileName.push(file.replace('.json', ''));
            });
            callback(false, trimmedFileName);
        } else {
            callback(true);
            console.log('Error to read the directory');
        }
    });
};

module.exports = lib;
