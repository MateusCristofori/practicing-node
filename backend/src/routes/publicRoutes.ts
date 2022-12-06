// import's
import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserActions } from "../controllers/userLogin";

const publicRouter = Router();
// Rotas
publicRouter.get('/', UserController.getAllUsersHandler);
publicRouter.post('/register', UserController.registerNewUserHandler);
publicRouter.post('/login', UserActions.userLogin);
publicRouter.put('/update/:id', UserController.updateUserHandler);
publicRouter.delete('/delete/:id', UserController.deleteUserByIdHandler);

export default publicRouter;