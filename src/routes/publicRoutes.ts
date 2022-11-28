// import's
import { Router } from "express";
import { deleteUserByIdHandler, getAllUsersHandler, registerNewUserHandler, updateUserHandler } from "../controllers/userController";
import { userLogin } from "../controllers/userLogin";

const publicRouter = Router();
// Rotas
publicRouter.get('/', getAllUsersHandler);
publicRouter.post('/register', registerNewUserHandler);
publicRouter.post('/login', userLogin);
publicRouter.put('/update/:id', updateUserHandler);
publicRouter.delete('/user/delete/:id', deleteUserByIdHandler);

export default publicRouter;