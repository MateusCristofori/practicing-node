import { Router } from "express";
import { deleteUserByIdHandler, getAllUsersHandler, registerNewUserHandler, updateUserHandler } from "../controllers/userController";


const router = Router();

router.get('/', getAllUsersHandler);
router.post('/user/register', registerNewUserHandler);
router.delete('/user/delete/:id', deleteUserByIdHandler)
router.put('user/update/:id', updateUserHandler)

export default router;