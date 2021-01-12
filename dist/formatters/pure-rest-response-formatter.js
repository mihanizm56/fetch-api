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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var get_is_status_code_success_1 = require("../utils/get-is-status-code-success");
var error_response_formatter_1 = require("../errors-formatter/error-response-formatter");
var PureRestResponseFormatter = /** @class */ (function (_super) {
    __extends(PureRestResponseFormatter, _super);
    function PureRestResponseFormatter(_a) {
        var isErrorTextStraightToOutput = _a.isErrorTextStraightToOutput, statusCode = _a.statusCode, translateFunction = _a.translateFunction, data = _a.data;
        var _this = _super.call(this) || this;
        _this.getPureRestErrorText = function (response) {
            var error = response.error, errorText = response.errorText, data = response.data;
            if (typeof data === 'string') {
                return data;
            }
            if (typeof errorText === 'string') {
                return errorText;
            }
            if (typeof error === 'string') {
                return error;
            }
            return '';
        };
        _this.getPureRestAdditionalErrors = function (response) {
            // get necessary fields from response
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            var additionalErrors = response.additionalErrors, errorText = response.errorText, restResponce = __rest(response, ["additionalErrors", "errorText"]);
            if (additionalErrors) {
                return additionalErrors;
            }
            // if backend wont give us a special field for error parameters
            // we will keep all data in additionalErrors IResponse field
            return restResponce;
        };
        _this.getFormattedResponse = function () { return ({
            data: _this.data,
            error: _this.error,
            errorText: _this.errorText,
            additionalErrors: _this.additionalErrors,
            code: _this.statusCode,
        }); };
        var isResponseStatusSuccess = get_is_status_code_success_1.getIsStatusCodeSuccess(statusCode);
        var errorTextKey = !isResponseStatusSuccess
            ? _this.getPureRestErrorText(data)
            : '';
        var additionalErrors = !isResponseStatusSuccess
            ? _this.getPureRestAdditionalErrors(data)
            : null;
        _this.error = !isResponseStatusSuccess;
        _this.translateFunction = translateFunction;
        _this.data = isResponseStatusSuccess ? data : {};
        _this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
        _this.statusCode = statusCode;
        _this.errorText = !isResponseStatusSuccess
            ? new error_response_formatter_1.ErrorResponseFormatter().getFormattedErrorTextResponse({
                errorTextKey: errorTextKey,
                translateFunction: translateFunction,
                isErrorTextStraightToOutput: isErrorTextStraightToOutput,
                errorTextData: additionalErrors,
                statusCode: statusCode,
            })
            : '';
        _this.additionalErrors = additionalErrors;
        return _this;
    }
    return PureRestResponseFormatter;
}(types_1.ResponseFormatter));
exports.PureRestResponseFormatter = PureRestResponseFormatter;
