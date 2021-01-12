"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = __importDefault(require("node-fetch"));
var query_string_1 = __importDefault(require("query-string"));
var is_node_1 = require("../utils/is-node");
var shared_1 = require("../constants/shared");
var response_type_validator_1 = require("../validators/response-type-validator");
var error_response_formatter_1 = require("../errors-formatter/error-response-formatter");
var timeout_1 = require("../constants/timeout");
var format_response_factory_1 = require("../formatters/format-response-factory");
var is_form_data_1 = require("../utils/is-form-data");
var get_data_from_selector_1 = require("../utils/get-data-from-selector");
var statuses_1 = require("../constants/statuses");
var make_error_request_logs_1 = require("../utils/make-error-request-logs");
var get_is_request_online_1 = require("../utils/get-is-request-online");
var response_data_parser_factory_1 = require("../utils/parsers/response-data-parser-factory");
var get_is_status_code_success_1 = require("../utils/get-is-status-code-success");
var BaseRequest = /** @class */ (function () {
    function BaseRequest() {
        var _this = this;
        this.abortRequestListener = null;
        this.parseResponseData = function (_a) {
            var response = _a.response, parseType = _a.parseType, isResponseStatusSuccess = _a.isResponseStatusSuccess, isStatusEmpty = _a.isStatusEmpty, isNotFound = _a.isNotFound, progressOptions = _a.progressOptions;
            return __awaiter(_this, void 0, void 0, function () {
                var responseDataParser, _b, error_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 6, , 7]);
                            if (isStatusEmpty) {
                                return [2 /*return*/, {}];
                            }
                            responseDataParser = new response_data_parser_factory_1.ResponseDataParserFactory().getParser({
                                parseType: parseType,
                                isResponseStatusSuccess: isResponseStatusSuccess,
                                isNotFound: isNotFound,
                                progressOptions: progressOptions
                            });
                            if (!isNotFound) return [3 /*break*/, 4];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, responseDataParser.parse(response)];
                        case 2: return [2 /*return*/, _c.sent()];
                        case 3:
                            _b = _c.sent();
                            return [2 /*return*/, {
                                    error: true,
                                    errorText: shared_1.NOT_FOUND_ERROR_KEY,
                                    data: null,
                                    additionalErrors: null
                                }];
                        case 4: return [4 /*yield*/, responseDataParser.parse(response)];
                        case 5: return [2 /*return*/, _c.sent()];
                        case 6:
                            error_1 = _c.sent();
                            console.error('(fetch-api): can not parse the response', error_1);
                            throw new Error(shared_1.NETWORK_ERROR_KEY);
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        this.addAbortListenerToRequest = function (_a) {
            var fetchController = _a.fetchController, abortRequestId = _a.abortRequestId;
            if (!_this.abortRequestListener) {
                _this.abortRequestListener = function (event) {
                    if (event.detail && event.detail.id === abortRequestId) {
                        fetchController.abort();
                    }
                };
            }
            document.addEventListener(shared_1.ABORT_REQUEST_EVENT_NAME, _this.abortRequestListener, true);
        };
        this.removeAbortListenerFromRequest = function () {
            if (_this.abortRequestListener) {
                document.removeEventListener(shared_1.ABORT_REQUEST_EVENT_NAME, _this.abortRequestListener, true);
                _this.abortRequestListener = null;
            }
        };
        // get an isomorfic fetch
        this.getIsomorphicFetch = function (_a) {
            var endpoint = _a.endpoint, fetchParams = _a.fetchParams, abortRequestId = _a.abortRequestId;
            var requestParams = BaseRequest.persistentOptions
                ? __assign(__assign({}, fetchParams), BaseRequest.persistentOptions) : fetchParams;
            if (is_node_1.isNode()) {
                var requestFetch_1 = (function () { return node_fetch_1.default(endpoint, requestParams); });
                return { requestFetch: requestFetch_1 };
            }
            var fetchController = new AbortController();
            // set the cancel request listener
            if (abortRequestId) {
                _this.addAbortListenerToRequest({
                    abortRequestId: abortRequestId,
                    fetchController: fetchController,
                });
            }
            var requestFetch = window.fetch.bind(null, endpoint, __assign(__assign({}, requestParams), { signal: fetchController.signal }));
            return {
                requestFetch: requestFetch,
                fetchController: fetchController,
            };
        };
        // get serialized endpoint
        this.getFormattedEndpoint = function (_a) {
            var endpoint = _a.endpoint, queryParams = _a.queryParams, arrayFormat = _a.arrayFormat;
            if (!queryParams) {
                return endpoint;
            }
            return endpoint + "?" + query_string_1.default.stringify(queryParams, {
                arrayFormat: arrayFormat || 'none'
            });
        };
        // get formatted fetch body in needed
        this.getFetchBody = function (_a) {
            var requestProtocol = _a.requestProtocol, body = _a.body, method = _a.method, version = _a.version, id = _a.id, isBatchRequest = _a.isBatchRequest;
            if (method === "GET") {
                return undefined;
            }
            if (requestProtocol === shared_1.requestProtocolsMap.jsonRpc) {
                if (isBatchRequest) {
                    return JSON.stringify(body);
                }
                return JSON.stringify(__assign(__assign(__assign({}, body), version), { id: id }));
            }
            if (is_form_data_1.isFormData(body)) {
                return body;
            }
            else {
                return JSON.stringify(body);
            }
        };
        this.getFormattedHeaders = function (_a) {
            var body = _a.body, headers = _a.headers;
            return is_form_data_1.isFormData(body)
                ? headers
                : (__assign({ "Content-type": "application/json" }, headers));
        };
        // TODO REFACTOR THIS FORMATTING!!!!!!
        this.getPreparedResponseData = function (_a) {
            var response = _a.response, translateFunction = _a.translateFunction, protocol = _a.protocol, isErrorTextStraightToOutput = _a.isErrorTextStraightToOutput, statusCode = _a.statusCode, parseType = _a.parseType, isBatchRequest = _a.isBatchRequest, responseSchema = _a.responseSchema, body = _a.body, isNotFound = _a.isNotFound;
            if ((parseType === 'blob' || parseType === 'text') && !isNotFound) {
                return {
                    data: response,
                    translateFunction: translateFunction,
                    protocol: protocol,
                    isErrorTextStraightToOutput: isErrorTextStraightToOutput,
                    parseType: parseType,
                    statusCode: statusCode,
                    error: false,
                    additionalErrors: null,
                    errorText: "",
                };
            }
            if (protocol === shared_1.requestProtocolsMap.pureRest) {
                return {
                    data: response,
                    statusCode: statusCode,
                    translateFunction: translateFunction,
                    protocol: protocol,
                    isErrorTextStraightToOutput: isErrorTextStraightToOutput,
                    parseType: parseType,
                };
            }
            if (isBatchRequest) {
                return {
                    translateFunction: translateFunction,
                    protocol: protocol,
                    isErrorTextStraightToOutput: isErrorTextStraightToOutput,
                    statusCode: statusCode,
                    parseType: shared_1.parseTypesMap.json,
                    data: response,
                    isBatchRequest: isBatchRequest,
                    responseSchema: responseSchema,
                    body: body
                };
            }
            return __assign(__assign({}, response), { translateFunction: translateFunction,
                protocol: protocol,
                isErrorTextStraightToOutput: isErrorTextStraightToOutput, isBlobGetRequest: false, statusCode: statusCode });
        };
        this.makeFetch = function (_a) {
            var id = _a.id, version = _a.version, headers = _a.headers, body = _a.body, mode = _a.mode, method = _a.method, endpoint = _a.endpoint, _b = _a.parseType, parseType = _b === void 0 ? shared_1.parseTypesMap.json : _b, queryParams = _a.queryParams, responseSchema = _a.responseSchema, requestProtocol = _a.requestProtocol, isErrorTextStraightToOutput = _a.isErrorTextStraightToOutput, extraValidationCallback = _a.extraValidationCallback, translateFunction = _a.translateFunction, customTimeout = _a.customTimeout, abortRequestId = _a.abortRequestId, arrayFormat = _a.arrayFormat, isBatchRequest = _a.isBatchRequest, progressOptions = _a.progressOptions, customSelectorData = _a.customSelectorData, selectData = _a.selectData, _c = _a.cache, cache = _c === void 0 ? shared_1.cacheMap.default : _c, // TODO проверить нужен ли дефолтный параметр,
            credentials = _a.credentials, integrity = _a.integrity, keepalive = _a.keepalive, redirect = _a.redirect, referrer = _a.referrer, referrerPolicy = _a.referrerPolicy, retry = _a.retry;
            var formattedEndpoint = _this.getFormattedEndpoint({
                endpoint: endpoint,
                queryParams: queryParams,
                arrayFormat: arrayFormat
            });
            var formattedHeaders = _this.getFormattedHeaders({
                body: body,
                headers: headers
            });
            var fetchBody = _this.getFetchBody({
                requestProtocol: requestProtocol,
                body: body,
                version: version,
                method: method,
                id: id,
                isBatchRequest: isBatchRequest
            });
            var _d = _this.getIsomorphicFetch({
                endpoint: formattedEndpoint,
                abortRequestId: abortRequestId,
                fetchParams: {
                    body: fetchBody,
                    mode: mode,
                    headers: formattedHeaders,
                    method: method,
                    cache: cache,
                    credentials: credentials,
                    integrity: integrity,
                    keepalive: keepalive,
                    redirect: redirect,
                    referrer: referrer,
                    referrerPolicy: referrerPolicy,
                },
            }), requestFetch = _d.requestFetch, fetchController = _d.fetchController;
            var getRequest = function (retryCounter) { return requestFetch()
                .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                var statusCode, isValidStatus, isStatusEmpty, isNotFound, isResponseStatusSuccess, respondedData, formatDataTypeValidator, isFormatValid, responseFormatter, formattedResponseData, selectedResponseData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            statusCode = response.status;
                            isValidStatus = statusCode <= 500;
                            isStatusEmpty = statusCode === 204;
                            isNotFound = statusCode === 404;
                            isResponseStatusSuccess = get_is_status_code_success_1.getIsStatusCodeSuccess(statusCode);
                            if (!isValidStatus) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.parseResponseData({
                                    response: response,
                                    parseType: parseType,
                                    isResponseStatusSuccess: isResponseStatusSuccess,
                                    isStatusEmpty: isStatusEmpty,
                                    isNotFound: isNotFound,
                                    progressOptions: progressOptions
                                })];
                        case 1:
                            respondedData = _a.sent();
                            formatDataTypeValidator = new response_type_validator_1.FormatDataTypeValidator().getFormatValidateMethod({
                                protocol: requestProtocol,
                                extraValidationCallback: extraValidationCallback,
                            });
                            isFormatValid = formatDataTypeValidator({
                                response: respondedData,
                                schema: responseSchema,
                                prevId: id,
                                isResponseStatusSuccess: isResponseStatusSuccess,
                                isStatusEmpty: isStatusEmpty,
                                isBatchRequest: isBatchRequest
                            });
                            if (isFormatValid) {
                                responseFormatter = new format_response_factory_1.FormatResponseFactory().createFormatter(this.getPreparedResponseData({
                                    response: respondedData,
                                    translateFunction: translateFunction,
                                    protocol: requestProtocol,
                                    isErrorTextStraightToOutput: isErrorTextStraightToOutput,
                                    parseType: parseType,
                                    statusCode: statusCode,
                                    isBatchRequest: isBatchRequest,
                                    responseSchema: responseSchema,
                                    body: body,
                                    isNotFound: isNotFound
                                }));
                                formattedResponseData = responseFormatter.getFormattedResponse();
                                // check if needs to retry request          
                                if (formattedResponseData.error && typeof retry !== 'undefined' && typeof retryCounter !== 'undefined' && retryCounter < retry) {
                                    return [2 /*return*/, getRequest(retryCounter + 1)];
                                }
                                selectedResponseData = selectData || customSelectorData
                                    ? get_data_from_selector_1.getDataFromSelector({ selectData: selectData, responseData: formattedResponseData, customSelectorData: customSelectorData })
                                    : formattedResponseData;
                                // remove the abort listener
                                this.removeAbortListenerFromRequest();
                                // return data
                                return [2 /*return*/, selectedResponseData];
                            }
                            _a.label = 2;
                        case 2: 
                        // if a status is above 500 - throw an error with default error message
                        throw new Error(isErrorTextStraightToOutput ? response.statusText : shared_1.NETWORK_ERROR_KEY);
                    }
                });
            }); })
                .catch(function (error) {
                var errorRequestMessage = isErrorTextStraightToOutput ? error.message : shared_1.NETWORK_ERROR_KEY;
                // check if needs to retry request   
                if (typeof retry !== 'undefined' && typeof retryCounter !== 'undefined' && retryCounter < retry) {
                    return getRequest(retryCounter + 1);
                }
                // make error logs
                make_error_request_logs_1.makeErrorRequestLogs({
                    endpoint: endpoint,
                    errorRequestMessage: errorRequestMessage,
                    fetchBody: fetchBody,
                });
                // remove the abort listener
                _this.removeAbortListenerFromRequest();
                var isOnlineRequest = get_is_request_online_1.getIsRequestOnline();
                var errorCode = isOnlineRequest ? statuses_1.REQUEST_ERROR_STATUS_CODE : statuses_1.OFFLINE_STATUS_CODE;
                return new error_response_formatter_1.ErrorResponseFormatter().getFormattedErrorResponse({
                    errorDictionaryParams: {
                        translateFunction: translateFunction,
                        errorTextKey: errorRequestMessage,
                        isErrorTextStraightToOutput: isErrorTextStraightToOutput,
                        statusCode: errorCode
                    },
                    statusCode: errorCode,
                });
            }); };
            return _this.requestRacer({
                request: getRequest(1),
                fetchController: fetchController,
                translateFunction: translateFunction,
                isErrorTextStraightToOutput: isErrorTextStraightToOutput,
                customTimeout: customTimeout
            });
        };
        this.requestRacer = function (_a) {
            var request = _a.request, fetchController = _a.fetchController, translateFunction = _a.translateFunction, isErrorTextStraightToOutput = _a.isErrorTextStraightToOutput, customTimeout = _a.customTimeout;
            var timeoutException = new Promise(function (resolve) {
                return setTimeout(function () {
                    var requestTimeoutError = new error_response_formatter_1.ErrorResponseFormatter().getFormattedErrorResponse({
                        errorDictionaryParams: {
                            translateFunction: translateFunction,
                            errorTextKey: shared_1.TIMEOUT_ERROR_KEY,
                            isErrorTextStraightToOutput: isErrorTextStraightToOutput,
                            statusCode: statuses_1.REQUEST_ERROR_STATUS_CODE
                        },
                        statusCode: statuses_1.REQUEST_ERROR_STATUS_CODE,
                    });
                    // if the window fetch
                    if (!is_node_1.isNode()) {
                        fetchController.abort();
                    }
                    resolve(requestTimeoutError);
                }, customTimeout || timeout_1.TIMEOUT_VALUE);
            });
            return Promise.race([request, timeoutException]);
        };
    }
    return BaseRequest;
}());
exports.BaseRequest = BaseRequest;
