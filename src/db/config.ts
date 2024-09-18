import { connect } from 'mongoose';
import { MONGO_URI } from '../utils/config';
import logger from '../utils/logger';
import UserRol from '../models/userRol.model';

const addDefaultRols = async()=>{
    const roles = [
        { rol: 'admin', descripcion: 'Administrador del eventos' },
        { rol: 'users', descripcion: 'Usuario regular' }
    ];
    roles.forEach(async (roleData) => {
        try {
            const existingRole = await UserRol.findOne({ rol: roleData.rol });
            if (!existingRole) {
                const newRole = new UserRol(roleData);
                await newRole.save();
                console.log(`Rol ${roleData.rol} creado.`);
            }
        } catch (error) {
            console.error(`Error al crear el rol ${roleData.rol}:`, error);
        }
    });
}

const connectDB = async () => {
    const uri = MONGO_URI;
    if (!uri) {
        logger.error('La URI de la base de datos no está definida');
        throw new Error('La URI de la base de datos no está definida');
    }
    try {
        await connect(uri);
        await addDefaultRols();
        logger.info('DB conectada');
    } catch (error) {
        logger.error('Error conectando a la base de datos', error);
        throw error;
    }
}
export default connectDB;