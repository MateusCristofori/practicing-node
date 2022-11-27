import { Router } from "express";
import { dashboardHandler } from "../controllers/privateEndPoint/dashboardHandler";
import { deleteUserByIdHandler, getAllUsersHandler, registerNewUserHandler, updateUserHandler } from "../controllers/userController";
import { userLogin, userLogOut } from "../controllers/userLogin";
import { tokenValidation } from "../middlewares/tokenValidation";


const router = Router();

router.get('/', getAllUsersHandler);
router.get('/dashboard', tokenValidation, dashboardHandler);
router.post('/register', registerNewUserHandler);
router.post('/login', userLogin);
router.post('/logout', userLogOut);
router.put('/update/:id', updateUserHandler);
router.delete('/user/delete/:id', deleteUserByIdHandler);

export default router;