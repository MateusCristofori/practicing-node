import { Router } from "express";
import { UserController } from "../controllers/userController";

const publicRouter = Router();
// Rotas
publicRouter.get('/', UserController.getAllUsersHandler);
publicRouter.get('/:id?', UserController.getUserByIdHandler);
publicRouter.post('/register', UserController.registerNewUserHandler);
publicRouter.post('/login', UserController.userLoginHandler);
publicRouter.get('/news', UserController.getNewsHandler);

export default publicRouter;