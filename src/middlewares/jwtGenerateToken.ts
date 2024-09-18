import pkg from 'jsonwebtoken';
const { sign } = pkg;
import { SECRET_KEY } from "../utils/config";
import logger from '../utils/logger';

export const generateToken = (userData = {}) => {
    try {
        const payload = { userData };
        const token = sign(payload, SECRET_KEY || 'default-secret-key', {
            expiresIn: '2h'
        });
        return token;
    } catch (error) {
        logger.error('Error al generar el token', error);
        return false;
    }
};