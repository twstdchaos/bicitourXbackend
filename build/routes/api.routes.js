"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_routes_1 = __importDefault(require("./user.routes"));
const event_routes_1 = __importDefault(require("./event.routes"));
router.use('/api', user_routes_1.default);
router.use('/api', event_routes_1.default);
exports.default = router;
