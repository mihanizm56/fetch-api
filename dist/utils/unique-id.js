"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var counter = 0;
// lodash uniqueId lol
exports.uniqueId = function (prefix) {
    var id = ++counter; // eslint-disable-line
    return prefix + id;
};
