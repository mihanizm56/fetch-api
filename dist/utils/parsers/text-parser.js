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
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../../types");
var TextParser = /** @class */ (function (_super) {
    __extends(TextParser, _super);
    function TextParser() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.parse = function (data) { return data.text(); };
        return _this;
    }
    return TextParser;
}(types_1.ResponseParser));
exports.TextParser = TextParser;
