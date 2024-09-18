"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.PASSWORD = exports.MAIL = exports.SECRET_KEY = exports.MONGO_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT;
exports.MONGO_URI = process.env.MONGO_URI;
exports.SECRET_KEY = process.env.SECRET_KEY;
exports.MAIL = process.env.MAIL;
exports.PASSWORD = process.env.PASSWORD;
exports.NODE_ENV = process.env.NODE_ENV;
