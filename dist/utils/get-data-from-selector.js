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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var json_mask_1 = __importDefault(require("json-mask"));
exports.getDataFromSelector = function (_a) {
    var selectData = _a.selectData, responseData = _a.responseData, customSelectorData = _a.customSelectorData;
    return customSelectorData
        ? __assign(__assign({}, responseData), { data: customSelectorData(responseData.data, selectData) }) : __assign(__assign({}, responseData), { data: json_mask_1.default(responseData.data, selectData) });
};
