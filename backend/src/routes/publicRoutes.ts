import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserActions } from "../controllers/userLogin";

const publicRouter = Router();
// Rotas
publicRouter.get('/', UserController.getAllUsersHandler);
publicRouter.get('/:id?', UserController.getUserByIdHandler);
publicRouter.post('/register', UserController.registerNewUserHandler);
publicRouter.post('/login', UserActions.userLogin);
publicRouter.get('/news', UserController.getNews);

export default publicRouter;