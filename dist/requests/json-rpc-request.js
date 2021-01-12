"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../constants/shared");
var base_request_1 = require("./base-request");
var unique_id_1 = require("../utils/unique-id");
var JSONRPCRequest = /** @class */ (function (_super) {
    __extends(JSONRPCRequest, _super);
    function JSONRPCRequest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getEnrichedBody = function (body) { return body.map(function (bodyRequestData) { return (__assign(__assign({}, bodyRequestData), { id: unique_id_1.uniqueId("json-rpc_"), jsonrpc: "2.0" })); }); };
        _this.makeRequest = function (requestParams) {
            return _this.makeFetch(__assign(__assign({}, requestParams), { id: unique_id_1.uniqueId("json-rpc_"), version: {
                    jsonrpc: "2.0"
                }, method: "POST", parseType: shared_1.parseTypesMap.json, requestProtocol: shared_1.requestProtocolsMap.jsonRpc, body: requestParams.isBatchRequest &&
                    requestParams.body &&
                    requestParams.body instanceof Array
                    ? _this.getEnrichedBody(requestParams.body)
                    : requestParams.body }));
        };
        return _this;
    }
    return JSONRPCRequest;
}(base_request_1.BaseRequest));
exports.JSONRPCRequest = JSONRPCRequest;
