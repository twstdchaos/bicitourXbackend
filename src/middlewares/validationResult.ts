import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const validateFields = (req: Request, res: Response, next: NextFunction): any => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        logger.warn('Errores de validación detectados', error.mapped());
        return res.status(400).json({
            ok: false,
            msg: error.mapped()
        });
    }
    next();
}

export default validateFields;