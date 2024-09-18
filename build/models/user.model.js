"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    pw: {
        type: String,
        required: true,
    },
    edad: {
        type: String,
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    nacionalidad: {
        type: String,
        required: true,
    },
    tipoDeDocumento: {
        type: String,
        required: true,
    },
    documentoDeIdentidad: {
        type: String,
        required: true,
    },
    numeroDeContacto: {
        type: String,
        required: true,
    },
    rol: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'UserRol',
        required: true,
    }
});
const Users = (0, mongoose_1.model)('Users', userSchema);
exports.default = Users;
