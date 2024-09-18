"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const validationBody_1 = require("../middlewares/validationBody");
const validationResult_1 = __importDefault(require("../middlewares/validationResult"));
const router = express_1.default.Router();
router.post('/registro', validationBody_1.users, validationResult_1.default, user_controller_1.createUser);
router.post('/login', validationBody_1.login, validationResult_1.default, user_controller_1.loginUser);
router.put('/update-user', validationResult_1.default, user_controller_1.updateUser);
router.delete('/delete-user', user_controller_1.deleteUser);
router.get('/get-user-email/:email', validationResult_1.default, user_controller_1.getUserByEmail);
exports.default = router;
