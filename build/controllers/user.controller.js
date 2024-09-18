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
exports.getUserByEmail = exports.deleteUser = exports.updateUser = exports.loginUser = exports.createUser = void 0;
const bcrypt_1 = require("bcrypt");
const jwtGenerateToken_1 = require("../middlewares/jwtGenerateToken");
const user_model_1 = __importDefault(require("../models/user.model"));
const logger_1 = __importDefault(require("../utils/logger"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, pw, edad, nombre, nacionalidad, documentoDeIdentidad, tipoDeDocumento, numeroDeContacto } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (user) {
            logger_1.default.info(`Intento de registro fallido: ${email} ya está en uso.`);
            return res.status(400).json({
                ok: false,
                msg: `${email} ya está en uso.`,
            });
        }
        const salt = (0, bcrypt_1.genSaltSync)();
        const dbUser = new user_model_1.default({
            email,
            pw: (0, bcrypt_1.hashSync)(pw, salt),
            edad,
            nombre,
            nacionalidad,
            tipoDeDocumento,
            documentoDeIdentidad,
            numeroDeContacto,
        });
        yield dbUser.save();
        logger_1.default.info(`Usuario creado exitosamente: ${email}`);
        return res.status(201).json({
            ok: true,
            msg: 'El usuario fue creado exitosamente',
            user: dbUser,
        });
    }
    catch (error) {
        logger_1.default.error(`Error al crear usuario: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contacta a soporte',
        });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, pw } = req.body;
    try {
        const dbUser = yield user_model_1.default.findOne({ email });
        if (!dbUser) {
            logger_1.default.info(`Intento de inicio de sesión fallido: ${email} no existe.`);
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe.',
            });
        }
        const validatePw = (0, bcrypt_1.compareSync)(pw, dbUser.pw);
        if (!validatePw) {
            logger_1.default.info(`Intento de inicio de sesión fallido: contraseña incorrecta para ${email}.`);
            return res.status(400).json({
                ok: false,
                msg: 'El correo y la contraseña no coinciden.',
            });
        }
        const token = (0, jwtGenerateToken_1.generateToken)(dbUser._id);
        logger_1.default.info(`Inicio de sesión exitoso: ${email}`);
        return res.status(200).json({
            ok: true,
            msg: 'Sesión iniciada',
            token,
            nombre: dbUser.nombre,
            email: dbUser.email,
        });
    }
    catch (error) {
        logger_1.default.error(`Error al iniciar sesión: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contacta a soporte',
        });
    }
});
exports.loginUser = loginUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, pw, edad, nombre } = req.body;
    try {
        const updatedData = {};
        if (email)
            updatedData.email = email;
        if (pw)
            updatedData.pw = (0, bcrypt_1.hashSync)(pw, (0, bcrypt_1.genSaltSync)());
        if (edad)
            updatedData.edad = edad;
        if (nombre)
            updatedData.nombre = nombre;
        const user = yield user_model_1.default.findOneAndUpdate({ email }, updatedData, { new: true });
        if (!user) {
            logger_1.default.info(`Intento de actualización fallido: usuario con email ${email} no fue encontrado.`);
            return res.status(400).json({
                ok: false,
                msg: `Usuario con email ${email} no fue encontrado`,
            });
        }
        logger_1.default.info(`Usuario actualizado exitosamente: ${email}`);
        return res.status(200).json({
            ok: true,
            msg: 'Usuario actualizado exitosamente',
            user,
        });
    }
    catch (error) {
        logger_1.default.error(`Error al actualizar usuario: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contacta a soporte',
        });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    try {
        const user = yield user_model_1.default.findOneAndDelete({ email });
        if (user) {
            logger_1.default.info(`Usuario eliminado exitosamente: ${email}`);
            return res.status(200).json({
                ok: true,
                msg: 'El usuario ha sido eliminado correctamente',
            });
        }
        logger_1.default.info(`Intento de eliminación fallido: usuario con email ${email} no fue encontrado.`);
        return res.status(400).json({
            ok: false,
            msg: 'El usuario no fue encontrado.',
        });
    }
    catch (error) {
        logger_1.default.error(`Error al eliminar usuario: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contacta a soporte',
        });
    }
});
exports.deleteUser = deleteUser;
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (user) {
            logger_1.default.info(`Usuario consultado exitosamente: ${email}`);
            return res.status(200).json({
                ok: true,
                email: user.email,
                pw: user.pw,
                edad: user.edad,
                nombre: user.nombre,
                nacionalidad: user.nacionalidad,
                tipoDeDocumento: user.tipoDeDocumento,
                documentoDeIdentidad: user.documentoDeIdentidad,
                numeroDeContacto: user.numeroDeContacto,
            });
        }
        logger_1.default.info(`Intento de consulta fallido: usuario con email ${email} no fue encontrado.`);
        return res.status(400).json({
            ok: false,
            msg: 'No se encontró el usuario.',
        });
    }
    catch (error) {
        logger_1.default.error(`Error al consultar usuario: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contacta a soporte.',
        });
    }
});
exports.getUserByEmail = getUserByEmail;
