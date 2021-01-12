"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var is_node_1 = require("./is-node");
exports.isFormData = function (body) {
    if (is_node_1.isNode()) {
        return false;
    }
    return body instanceof FormData;
};
