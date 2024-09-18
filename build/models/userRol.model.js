"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userRolSchema = new mongoose_1.Schema({
    rol: {
        type: String,
        required: true,
        unique: true,
    },
    descripcion: {
        type: String,
        required: false,
    }
});
const UserRol = (0, mongoose_1.model)('UserRol', userRolSchema);
exports.default = UserRol;
