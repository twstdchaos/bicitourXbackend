import { body } from 'express-validator'

const users = [
    body('email', 'No dejes este campo vacío').notEmpty(),
    body('email', 'El email es inválido').normalizeEmail().isEmail(),
    body('pw', 'No dejes este campo vacío').notEmpty(),
    body('pw', 'Escribe una contraseña segura con al menos 8 caracteres, una letra mayúscula, minúscula, números y caracteres').isStrongPassword().isLength({min:8}),
    body('nombre', 'No dejes este campo vacío').notEmpty(),
    body('nacionalidad', 'No dejes este campo vacío').notEmpty(),
    body('documentoDeIdentidad', 'No dejes este campo vacío').notEmpty(),
    body('documentoDeIdentidad', 'Escribe solo numeros').isNumeric(),
    body('numeroDeContacto', 'No dejes este campo vacío').isNumeric().notEmpty()
]

const login = [
    body('email', 'No dejes este campo vacío').notEmpty(),
    body('pw', 'No dejes este campo vacío').notEmpty(),
    body('email', 'El email es inválido').normalizeEmail().isEmail(),
    body('pw', 'Escribe una contraseña segura con al menos 8 caracteres, una letra mayúscula, minúscula, números y caracteres').isStrongPassword().isLength({ min:8})
]

const events = [
    body('name', 'El nombre del evento no puede estar vacio').notEmpty(),
    body('date', 'La fecha del evento no puede estar vacia').notEmpty(),
    body('hour', 'La hora del evento no puede estar vacia').notEmpty(),
    body('location', 'El lugar del evento no puede estar vacio').notEmpty(),
    body('cost', 'El costo del evento no puede estar vacio').notEmpty(),
    body('distance', 'La distancia del evento no puede estar vacia').notEmpty(),
    body('capacity', 'La capicidad de personas del evento no puede estar vacia').notEmpty(),
    body('category', 'La categoria de la carrera no puede estar vacia').notEmpty(),
    
]

export {
    users,
    events,
    login
}