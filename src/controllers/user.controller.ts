import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { generateToken } from '../middlewares/jwtGenerateToken';
import { Request, Response } from "express";
import Users from '../models/user.model';
import logger from '../utils/logger';
import UserRol from '../models/userRol.model';

const createUser = async (req: Request, res: Response) => {
    const { email, pw, edad, nombre, nacionalidad, documentoDeIdentidad, tipoDeDocumento, numeroDeContacto } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (user) {
            logger.info(`Intento de registro fallido: ${email} ya está en uso.`);
            return res.status(400).json({
                ok: false,
                msg: `${email} ya está en uso.`,
            });
        }
        const userRole = await UserRol.findOne({ rol: 'users' });
        if (!userRole) {
            logger.error(`Error: El rol 'users' no existe en la base de datos.`);
            return res.status(500).json({
                ok: false,
                msg: 'Error en el servidor: Rol de usuario no encontrado.',
            });
        }
        const salt = genSaltSync();
        const dbUser = new Users({
            email,
            pw: hashSync(pw, salt),
            edad,
            nombre,
            nacionalidad,
            tipoDeDocumento,
            documentoDeIdentidad,
            numeroDeContacto,
            rol: userRole._id,
        });
        await dbUser.save();
        logger.info(`Usuario creado exitosamente: ${email}`);
        return res.status(201).json({
            ok: true,
            msg: 'El usuario fue creado exitosamente',
            user: dbUser,
        });
    } catch (error) {
        logger.error(`Error al crear usuario: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contacta a soporte',
        });
    }
};

const loginUser = async (req: Request, res: Response) => {
    const { email, pw } = req.body;
    try {
        const dbUser = await Users.findOne({ email }).populate('rol');
        console.log(dbUser)
        if (!dbUser) {
            logger.info(`Intento de inicio de sesión fallido: ${email} no existe.`);
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe.',
            });
        }

        const validatePw = compareSync(pw, dbUser.pw);
        if (!validatePw) {
            logger.info(`Intento de inicio de sesión fallido: contraseña incorrecta para ${email}.`);
            return res.status(400).json({
                ok: false,
                msg: 'El correo y la contraseña no coinciden.',
            });
        }

        const token = generateToken(dbUser._id);

        logger.info(`Inicio de sesión exitoso: ${email}`);
        return res.status(200).json({
            ok: true,
            msg: 'Sesión iniciada',
            token,
            id: dbUser._id,
            nombre: dbUser.nombre,
            email: dbUser.email,
            rol: dbUser.rol,
        });
    } catch (error) {
        logger.error(`Error al iniciar sesión: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contacta a soporte',
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    const { email, pw, edad, nombre } = req.body;
    try {
        const updatedData: Partial<typeof req.body> = {};
        if (email) updatedData.email = email;
        if (pw) updatedData.pw = hashSync(pw, genSaltSync());
        if (edad) updatedData.edad = edad;
        if (nombre) updatedData.nombre = nombre;
        const user = await Users.findOneAndUpdate({ email }, updatedData, { new: true });
        if (!user) {
            logger.info(`Intento de actualización fallido: usuario con email ${email} no fue encontrado.`);
            return res.status(400).json({
                ok: false,
                msg: `Usuario con email ${email} no fue encontrado`,
            });
        }
        logger.info(`Usuario actualizado exitosamente: ${email}`);
        return res.status(200).json({
            ok: true,
            msg: 'Usuario actualizado exitosamente',
            user,
        });
    } catch (error) {
        logger.error(`Error al actualizar usuario: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contacta a soporte',
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    const { email } = req.query;
    try {
        const user = await Users.findOneAndDelete({ email });
        if (user) {
            logger.info(`Usuario eliminado exitosamente: ${email}`);
            return res.status(200).json({
                ok: true,
                msg: 'El usuario ha sido eliminado correctamente',
            });
        }
        logger.info(`Intento de eliminación fallido: usuario con email ${email} no fue encontrado.`);
        return res.status(400).json({
            ok: false,
            msg: 'El usuario no fue encontrado.',
        });
    } catch (error) {
        logger.error(`Error al eliminar usuario: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contacta a soporte',
        });
    }
};

const getUserByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const user = await Users.findOne({ email });
        if (user) {
            logger.info(`Usuario consultado exitosamente: ${email}`);
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
        logger.info(`Intento de consulta fallido: usuario con email ${email} no fue encontrado.`);
        return res.status(400).json({
            ok: false,
            msg: 'No se encontró el usuario.',
        });
    } catch (error) {
        logger.error(`Error al consultar usuario: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contacta a soporte.',
        });
    }
};

const assignRoleToUser = async (req: Request, res: Response) => {
    const { userId, roleId } = req.body;
    try {
        const role = await UserRol.findById(roleId);
        if (!role) {
            return res.status(404).json({
                ok: false,
                msg: 'El rol especificado no existe.',
            });
        }
        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            { rol: roleId },
            { new: true }
        ).populate('rol');
        if (!updatedUser) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario especificado no existe.',
            });
        }
        return res.status(200).json({
            ok: true,
            msg: 'Rol asignado correctamente al usuario.',
            user: {
                id: updatedUser._id,
                nombre: updatedUser.nombre,
                email: updatedUser.email,
                rol: updatedUser.rol
            },
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al asignar el rol al usuario. Por favor, contacte a soporte.',
        });
    }
};

export {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getUserByEmail,
    assignRoleToUser
};
