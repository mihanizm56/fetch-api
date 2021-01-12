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
var types_1 = require("../types");
var error_response_formatter_1 = require("../errors-formatter/error-response-formatter");
var response_type_validator_1 = require("../validators/response-type-validator");
var shared_1 = require("../constants/shared");
var jsonrpc_response_formatter_1 = require("./jsonrpc-response-formatter");
var JSONRPCBatchResponseFormatter = /** @class */ (function (_super) {
    __extends(JSONRPCBatchResponseFormatter, _super);
    function JSONRPCBatchResponseFormatter(_a) {
        var data = _a.data, isErrorTextStraightToOutput = _a.isErrorTextStraightToOutput, statusCode = _a.statusCode, translateFunction = _a.translateFunction, responseSchema = _a.responseSchema, body = _a.body;
        var _this = _super.call(this) || this;
        _this.getFormattedData = function () {
            return _this.data.map(function (responseItemData, index) {
                var validator = new response_type_validator_1.FormatDataTypeValidator();
                var prevId = _this.body ? _this.body[index].id : null;
                var schema = _this.responseSchema ? _this.responseSchema[index] : null;
                var dataItemCode = responseItemData.error ? 500 : 200;
                var isFormatValid = validator.getJSONRPCFormatIsValid({
                    response: responseItemData,
                    schema: schema,
                    prevId: prevId,
                });
                if (isFormatValid) {
                    return new jsonrpc_response_formatter_1.JSONRPCResponseFormatter(__assign(__assign({}, responseItemData), { isErrorTextStraightToOutput: _this.isErrorTextStraightToOutput, statusCode: dataItemCode, translateFunction: _this.translateFunction })).getFormattedResponse();
                }
                return new error_response_formatter_1.ErrorResponseFormatter().getFormattedErrorResponse({
                    errorDictionaryParams: {
                        errorTextKey: shared_1.NETWORK_ERROR_KEY,
                        isErrorTextStraightToOutput: _this.isErrorTextStraightToOutput,
                        translateFunction: _this.translateFunction,
                        statusCode: 500,
                    },
                    statusCode: 500,
                });
            });
        };
        _this.getFormattedResponse = function () {
            var formattedData = _this.getFormattedData();
            return {
                errorText: '',
                error: false,
                data: formattedData,
                additionalErrors: null,
                code: _this.statusCode,
            };
        };
        _this.data = data;
        _this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
        _this.statusCode = statusCode;
        _this.translateFunction = translateFunction;
        _this.responseSchema = responseSchema;
        _this.body = body;
        return _this;
    }
    return JSONRPCBatchResponseFormatter;
}(types_1.ResponseFormatter));
exports.JSONRPCBatchResponseFormatter = JSONRPCBatchResponseFormatter;
