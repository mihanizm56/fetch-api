"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../constants/shared");
var jsonrpc_response_formatter_1 = require("./jsonrpc-response-formatter");
var rest_response_formatter_1 = require("./rest-response-formatter");
var blob_response_formatter_1 = require("./blob-response-formatter");
var text_response_formatter_1 = require("./text-response-formatter");
var jsonrpc_batch_response_formatter_1 = require("./jsonrpc-batch-response-formatter");
var pure_rest_response_formatter_1 = require("./pure-rest-response-formatter");
var FormatResponseFactory = /** @class */ (function () {
    function FormatResponseFactory() {
        this.createFormatter = function (_a) {
            var translateFunction = _a.translateFunction, protocol = _a.protocol, data = _a.data, error = _a.error, _b = _a.errorText, errorText = _b === void 0 ? '' : _b, _c = _a.additionalErrors, additionalErrors = _c === void 0 ? null : _c, result = _a.result, _d = _a.jsonrpc, jsonrpc = _d === void 0 ? '' : _d, _e = _a.id, id = _e === void 0 ? '' : _e, isErrorTextStraightToOutput = _a.isErrorTextStraightToOutput, parseType = _a.parseType, statusCode = _a.statusCode, isBatchRequest = _a.isBatchRequest, body = _a.body, responseSchema = _a.responseSchema;
            if (parseType === shared_1.parseTypesMap.blob) {
                return new blob_response_formatter_1.BlobResponseFormatter(data);
            }
            if (parseType === shared_1.parseTypesMap.text) {
                return new text_response_formatter_1.TextResponseFormatter(data);
            }
            if (protocol === shared_1.requestProtocolsMap.jsonRpc) {
                if (isBatchRequest && data instanceof Array) {
                    return new jsonrpc_batch_response_formatter_1.JSONRPCBatchResponseFormatter({
                        data: data,
                        translateFunction: translateFunction,
                        isErrorTextStraightToOutput: isErrorTextStraightToOutput,
                        statusCode: statusCode,
                        body: body,
                        responseSchema: responseSchema,
                    });
                }
                return new jsonrpc_response_formatter_1.JSONRPCResponseFormatter({
                    // eslint-disable-next-line
                    // @ts-ignore
                    error: error,
                    jsonrpc: jsonrpc,
                    id: id,
                    result: result,
                    translateFunction: translateFunction,
                    isErrorTextStraightToOutput: isErrorTextStraightToOutput,
                    statusCode: statusCode,
                });
            }
            if (protocol === shared_1.requestProtocolsMap.pureRest) {
                return new pure_rest_response_formatter_1.PureRestResponseFormatter({
                    isErrorTextStraightToOutput: isErrorTextStraightToOutput,
                    statusCode: statusCode,
                    translateFunction: translateFunction,
                    data: data,
                });
            }
            return new rest_response_formatter_1.RestResponseFormatter({
                data: data,
                error: Boolean(error),
                errorText: errorText,
                additionalErrors: additionalErrors,
                translateFunction: translateFunction,
                isErrorTextStraightToOutput: isErrorTextStraightToOutput,
                statusCode: statusCode,
            });
        };
    }
    return FormatResponseFactory;
}());
exports.FormatResponseFactory = FormatResponseFactory;
