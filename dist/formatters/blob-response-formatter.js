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
var types_1 = require("../types");
var BlobResponseFormatter = /** @class */ (function (_super) {
    __extends(BlobResponseFormatter, _super);
    function BlobResponseFormatter(data) {
        var _this = _super.call(this) || this;
        _this.getFormattedResponse = function () { return ({
            errorText: '',
            error: false,
            data: _this.data,
            additionalErrors: null,
            code: 200,
        }); };
        _this.data = data;
        return _this;
    }
    return BlobResponseFormatter;
}(types_1.ResponseFormatter));
exports.BlobResponseFormatter = BlobResponseFormatter;
