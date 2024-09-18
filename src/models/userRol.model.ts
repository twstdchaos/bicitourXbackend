import { Schema, model } from 'mongoose';
const userRolSchema = new Schema({
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
const UserRol = model('UserRol', userRolSchema);
export default UserRol;