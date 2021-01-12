"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeErrorRequestLogs = function (_a) {
    var endpoint = _a.endpoint, errorRequestMessage = _a.errorRequestMessage, fetchBody = _a.fetchBody;
    console.error('(fetch-api): get error in the request', endpoint);
    console.group('Show error data');
    console.error('(fetch-api): message:', errorRequestMessage);
    console.error('(fetch-api): endpoint:', endpoint);
    console.error('(fetch-api): body params:', fetchBody);
    console.groupEnd();
};
