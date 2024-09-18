"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { sign } = jsonwebtoken_1.default;
const config_1 = require("../utils/config");
const logger_1 = __importDefault(require("../utils/logger"));
const generateToken = (userData = {}) => {
    try {
        const payload = { userData };
        const token = sign(payload, config_1.SECRET_KEY || 'default-secret-key', {
            expiresIn: '2h'
        });
        return token;
    }
    catch (error) {
        logger_1.default.error('Error al generar el token', error);
        return false;
    }
};
exports.generateToken = generateToken;
