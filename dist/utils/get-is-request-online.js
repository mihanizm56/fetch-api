"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIsRequestOnline = function () {
    if (typeof navigator === 'undefined') {
        return false;
    }
    return navigator.onLine;
};
