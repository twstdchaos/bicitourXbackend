"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.events = exports.users = void 0;
const express_validator_1 = require("express-validator");
const users = [
    (0, express_validator_1.body)('email', 'No dejes este campo vacío').notEmpty(),
    (0, express_validator_1.body)('email', 'El email es inválido').normalizeEmail().isEmail(),
    (0, express_validator_1.body)('pw', 'No dejes este campo vacío').notEmpty(),
    (0, express_validator_1.body)('pw', 'Escribe una contraseña segura con al menos 8 caracteres, una letra mayúscula, minúscula, números y caracteres').isStrongPassword().isLength({ min: 8 }),
    (0, express_validator_1.body)('nombre', 'No dejes este campo vacío').notEmpty(),
    (0, express_validator_1.body)('nacionalidad', 'No dejes este campo vacío').notEmpty(),
    (0, express_validator_1.body)('documentoDeIdentidad', 'No dejes este campo vacío').notEmpty(),
    (0, express_validator_1.body)('documentoDeIdentidad', 'Escribe solo numeros').isNumeric(),
    (0, express_validator_1.body)('numeroDeContacto', 'No dejes este campo vacío').isNumeric().notEmpty()
];
exports.users = users;
const login = [
    (0, express_validator_1.body)('email', 'No dejes este campo vacío').notEmpty(),
    (0, express_validator_1.body)('pw', 'No dejes este campo vacío').notEmpty(),
    (0, express_validator_1.body)('email', 'El email es inválido').normalizeEmail().isEmail(),
    (0, express_validator_1.body)('pw', 'Escribe una contraseña segura con al menos 8 caracteres, una letra mayúscula, minúscula, números y caracteres').isStrongPassword().isLength({ min: 8 })
];
exports.login = login;
const events = [
    (0, express_validator_1.body)('name', 'El nombre del evento no puede estar vacio').notEmpty(),
    (0, express_validator_1.body)('date', 'La fecha del evento no puede estar vacia').notEmpty(),
    (0, express_validator_1.body)('hour', 'La hora del evento no puede estar vacia').notEmpty(),
    (0, express_validator_1.body)('location', 'El lugar del evento no puede estar vacio').notEmpty(),
    (0, express_validator_1.body)('cost', 'El costo del evento no puede estar vacio').notEmpty(),
    (0, express_validator_1.body)('distance', 'La distancia del evento no puede estar vacia').notEmpty(),
    (0, express_validator_1.body)('capacity', 'La capicidad de personas del evento no puede estar vacia').notEmpty(),
    (0, express_validator_1.body)('category', 'La categoria de la carrera no puede estar vacia').notEmpty(),
];
exports.events = events;
