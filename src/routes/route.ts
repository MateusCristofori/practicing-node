import { Router } from "express";
import { deleteUserByIdHandler, getAllUsersHandler, registerNewUserHandler, updateUserHandler } from "../controllers/userController";
import { userLogin, userLogOut } from "../controllers/userLogin";
import { tokenValidation } from "../middlewares/tokenValidation";


const router = Router();

router.get('/', getAllUsersHandler);
router.post('/user/register', registerNewUserHandler);
router.post('/user/login', userLogin);
router.post('/logout', userLogOut);
router.delete('/user/delete/:id', deleteUserByIdHandler);
router.put('user/update/:id', updateUserHandler);

export default router;