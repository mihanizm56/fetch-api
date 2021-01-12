"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base_request_1 = require("../../requests/base-request");
var FetchProxyMaker = /** @class */ (function () {
    function FetchProxyMaker() {
    }
    // TODO in future
    // setPrefetchMiddleware(callback,{}){}
    // TODO in future
    // setPostfetchMiddleware(callback,{}){}
    // adds params to all requests
    FetchProxyMaker.prototype.setPersistentOptions = function (callback) {
        base_request_1.BaseRequest.persistentOptions = callback();
    };
    return FetchProxyMaker;
}());
exports.FetchProxyMaker = FetchProxyMaker;
