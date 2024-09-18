"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const logger_1 = __importDefault(require("../utils/logger"));
const validateFields = (req, res, next) => {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        logger_1.default.warn('Errores de validación detectados', error.mapped());
        return res.status(400).json({
            ok: false,
            msg: error.mapped()
        });
    }
    next();
};
exports.default = validateFields;
