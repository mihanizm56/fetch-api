"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../../constants/shared");
var is_node_1 = require("../is-node");
var blob_parse_1 = require("./blob-parse");
var json_parser_1 = require("./json-parser");
var progress_parser_1 = require("./progress-parser");
var text_parser_1 = require("./text-parser");
var ResponseDataParserFactory = /** @class */ (function () {
    function ResponseDataParserFactory() {
        this.getParser = function (_a) {
            var parseType = _a.parseType, isResponseStatusSuccess = _a.isResponseStatusSuccess, isNotFound = _a.isNotFound, progressOptions = _a.progressOptions;
            // if response is not success - then parse the response like json
            // because backend must send an error it with JSON
            if (isNotFound || !isResponseStatusSuccess) {
                return new json_parser_1.JsonParser();
            }
            // progress not run on nodejs yet
            if (progressOptions && parseType && !is_node_1.isNode()) {
                return new progress_parser_1.ProgressParser();
            }
            if (parseType === shared_1.parseTypesMap.json) {
                return new json_parser_1.JsonParser();
            }
            if (parseType === shared_1.parseTypesMap.blob) {
                return new blob_parse_1.BlobParser();
            }
            if (parseType === shared_1.parseTypesMap.text) {
                return new text_parser_1.TextParser();
            }
            return new json_parser_1.JsonParser();
        };
    }
    return ResponseDataParserFactory;
}());
exports.ResponseDataParserFactory = ResponseDataParserFactory;
