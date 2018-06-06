exports.mkdir = mkdir;
exports.isExsistDir = isExsistDir;
exports.fileExt = fileExt;
exports.uniqueName = uniqueName;

const path = require('path');
const mkdirp = require('mkdirp');
const uuidV4 = require('uuid/v4');             //http://hyeonjae.github.io/uuid/2015/03/17/uuid.html
const replaceall = require("replaceall");
const fs = require('fs');

function fileExt(filename) {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length);
}

function uniqueName() {
    return replaceall('-', '', uuidV4());
};

function isExsistDir(path) {
    if (!fs.existsSync(path)) {
        return false;
    }
    return true;
};

function mkdir(path) {
    mkdirp.sync(path);
    return true;
};
