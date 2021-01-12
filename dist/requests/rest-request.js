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
var RestRequest = /** @class */ (function (_super) {
    __extends(RestRequest, _super);
    function RestRequest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getRequest = function (requestParams) {
            return _this.makeFetch(__assign(__assign({}, requestParams), { method: "GET", parseType: shared_1.parseTypesMap.json, requestProtocol: shared_1.requestProtocolsMap.rest }));
        };
        _this.postRequest = function (requestParams) {
            return _this.makeFetch(__assign(__assign({}, requestParams), { method: "POST", parseType: shared_1.parseTypesMap.json, requestProtocol: shared_1.requestProtocolsMap.rest }));
        };
        _this.putRequest = function (requestParams) {
            return _this.makeFetch(__assign(__assign({}, requestParams), { method: "PUT", parseType: shared_1.parseTypesMap.json, requestProtocol: shared_1.requestProtocolsMap.rest }));
        };
        _this.patchRequest = function (requestParams) {
            return _this.makeFetch(__assign(__assign({}, requestParams), { method: "PATCH", parseType: shared_1.parseTypesMap.json, requestProtocol: shared_1.requestProtocolsMap.rest }));
        };
        _this.deleteRequest = function (requestParams) {
            return _this.makeFetch(__assign(__assign({}, requestParams), { method: "DELETE", parseType: shared_1.parseTypesMap.json, requestProtocol: shared_1.requestProtocolsMap.rest }));
        };
        _this.getBlobRequest = function (requestParams) {
            return _this.makeFetch(__assign(__assign({}, requestParams), { method: "GET", parseType: shared_1.parseTypesMap.blob, requestProtocol: shared_1.requestProtocolsMap.rest, extraValidationCallback: function () { return true; }, isErrorTextStraightToOutput: false }));
        };
        _this.getTextRequest = function (requestParams) {
            return _this.makeFetch(__assign(__assign({}, requestParams), { method: "GET", parseType: shared_1.parseTypesMap.blob, requestProtocol: shared_1.requestProtocolsMap.rest, extraValidationCallback: function () { return true; }, isErrorTextStraightToOutput: false }));
        };
        return _this;
    }
    return RestRequest;
}(base_request_1.BaseRequest));
exports.RestRequest = RestRequest;
