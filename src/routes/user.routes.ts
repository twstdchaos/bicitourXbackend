import express from 'express';
import validateFields from '../middlewares/validationResult';
import { createUser, loginUser, updateUser, deleteUser, getUserByEmail, assignRoleToUser } from '../controllers/user.controller';
import { users, login } from '../middlewares/validationBody';

const router = express.Router();
router.post('/registro', users, validateFields, createUser);
router.post('/login', login, validateFields, loginUser);
router.put('/update-user', validateFields, updateUser);
router.delete('/delete-user', deleteUser);
router.get('/get-user-email/:email', validateFields, getUserByEmail);
router.post('/assign-role', assignRoleToUser);
export default router;