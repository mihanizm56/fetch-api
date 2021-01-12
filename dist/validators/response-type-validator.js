"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../constants/shared");
var FormatDataTypeValidator = /** @class */ (function () {
    function FormatDataTypeValidator() {
        var _this = this;
        this.getIsRestFormatResponseValid = function (response) {
            return 'error' in response &&
                'errorText' in response &&
                'additionalErrors' in response &&
                'data' in response;
        };
        this.getIsJSONRPCFormatResponseValid = function (response) {
            return Boolean(('result' in response ||
                (response.error &&
                    'code' in response.error &&
                    'data' in response.error &&
                    'trKey' in response.error.data &&
                    'message' in response.error)) &&
                'jsonrpc' in response &&
                'id' in response);
        };
        this.getIsSchemaResponseValid = function (_a) {
            var data = _a.data, error = _a.error, schema = _a.schema;
            // if the error flag is true
            if (error) {
                return { error: false, errorText: '' };
            }
            var validationResult = schema.validate(data, {
                allowUnknown: true,
                abortEarly: false,
            });
            return {
                error: Boolean(validationResult.error),
                errorText: validationResult.error,
            };
        };
        this.getCompareIds = function (_a) {
            var requestId = _a.requestId, responceId = _a.responceId;
            return requestId === responceId;
        };
        // todo fix any type
        this.getRestFormatIsValid = function (_a) {
            var response = _a.response, schema = _a.schema;
            if (!Boolean(response)) {
                console.error('(fetch-api): response is empty');
                return false;
            }
            var isFormatValid = _this.getIsRestFormatResponseValid(response);
            // if the base format is not valid
            if (!isFormatValid) {
                console.error('(fetch-api): response base format is not valid');
                console.error('(fetch-api): full response: ', response);
                return false;
            }
            var _b = _this.getIsSchemaResponseValid({
                data: response.data,
                error: response.error,
                schema: schema,
            }), isSchemaError = _b.error, schemaErrorValue = _b.errorText;
            // if the schema format is not valid
            if (isSchemaError) {
                console.error('(fetch-api): response schema format is not valid');
                console.error('(fetch-api): error in schema', schemaErrorValue);
                return false;
            }
            return true;
        };
        this.checkIdsEquality = function (_a) {
            var prev = _a.prev, curr = _a.curr;
            return prev === curr;
        };
        // todo fix any type
        this.getJSONRPCFormatIsValid = function (_a) {
            var response = _a.response, schema = _a.schema, prevId = _a.prevId, isBatchRequest = _a.isBatchRequest;
            // return true because all validation will be prepared in Formatter
            if (isBatchRequest) {
                return true;
            }
            if (!Boolean(response)) {
                console.error('(fetch-api): response is empty');
                console.error('(fetch-api): full response: ', response);
                return false;
            }
            var idsAreEqual = _this.checkIdsEquality({
                prev: prevId,
                curr: response.id,
            });
            // if ids are not equal
            if (!idsAreEqual) {
                console.error('(fetch-api): request-response ids are not equal');
                return false;
            }
            var isFormatValid = _this.getIsJSONRPCFormatResponseValid(response);
            // if the base format is not valid
            if (!isFormatValid) {
                console.error('(fetch-api): response base format is not valid');
                console.error('(fetch-api): full response: ', response);
                return false;
            }
            var _b = _this.getIsSchemaResponseValid({
                data: response.result,
                error: Boolean(response.error),
                schema: schema,
            }), isSchemaError = _b.error, schemaErrorValue = _b.errorText;
            // if the schema format is not valid
            if (isSchemaError) {
                console.error('(fetch-api): response schema format is not valid');
                console.error('(fetch-api): error in schema', schemaErrorValue);
                return false;
            }
            return true;
        };
        this.getPureRestFormatIsValid = function (_a) {
            var response = _a.response, schema = _a.schema, isResponseStatusSuccess = _a.isResponseStatusSuccess, isStatusEmpty = _a.isStatusEmpty;
            if (isStatusEmpty) {
                return true;
            }
            if (!Boolean(response)) {
                console.error('(fetch-api): response is empty');
                console.error('(fetch-api): full response: ', response);
                return false;
            }
            var _b = _this.getIsSchemaResponseValid({
                data: response,
                error: !isResponseStatusSuccess,
                schema: schema,
            }), isSchemaError = _b.error, schemaErrorValue = _b.errorText;
            // if the schema format is not valid
            if (isSchemaError) {
                console.error('(fetch-api): response schema format is not valid');
                console.error('(fetch-api): error in schema', schemaErrorValue);
                return false;
            }
            return true;
        };
        this.getFormatValidateMethod = function (_a) {
            var protocol = _a.protocol, extraValidationCallback = _a.extraValidationCallback;
            // if there is an extra callback for validations
            if (extraValidationCallback) {
                return extraValidationCallback;
            }
            switch (protocol) {
                case shared_1.requestProtocolsMap.rest:
                    return _this.getRestFormatIsValid;
                case shared_1.requestProtocolsMap.jsonRpc:
                    return _this.getJSONRPCFormatIsValid;
                case shared_1.requestProtocolsMap.pureRest:
                    return _this.getPureRestFormatIsValid;
                default:
                    return _this.getRestFormatIsValid;
            }
        };
    }
    return FormatDataTypeValidator;
}());
exports.FormatDataTypeValidator = FormatDataTypeValidator;
