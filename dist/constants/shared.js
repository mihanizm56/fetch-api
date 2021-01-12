"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMap = {
    default: 'default',
    forceCache: 'force-cache',
    noCache: 'no-cache',
    noStore: 'no-store',
    onlyIfCached: 'only-if-cached',
    reload: 'reload',
};
exports.parseTypesMap = {
    json: 'json',
    blob: 'blob',
    text: 'text',
};
// todo fix similar
exports.requestProtocolsMap = {
    rest: 'rest',
    jsonRpc: 'jsonRpc',
    pureRest: 'pureRest',
};
exports.TIMEOUT_ERROR_KEY = 'timeout-error';
exports.NETWORK_ERROR_KEY = 'network-error';
exports.NOT_FOUND_ERROR_KEY = 'not-found-error';
exports.ABORTED_ERROR_TEXT_CHROME = 'The user aborted a request.';
exports.ABORTED_ERROR_TEXT_MOZILLA = 'The operation was aborted. ';
exports.ABORTED_ERROR_TEXT_SAFARI = 'Fetch is aborted';
exports.ABORT_REQUEST_EVENT_NAME = 'abort_request_event';
