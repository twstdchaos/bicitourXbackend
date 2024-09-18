"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = require("../utils/config");
const logger_1 = __importDefault(require("../utils/logger"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const uri = config_1.MONGO_URI;
    if (!uri) {
        logger_1.default.error('La URI de la base de datos no está definida');
        throw new Error('La URI de la base de datos no está definida');
    }
    try {
        yield (0, mongoose_1.connect)(uri);
        logger_1.default.info('DB conectada');
    }
    catch (error) {
        logger_1.default.error('Error conectando a la base de datos', error);
        throw error;
    }
});
exports.default = connectDB;
