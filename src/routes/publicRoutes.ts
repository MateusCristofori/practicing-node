import { Router } from "express";
import { UserController } from "../controllers/userController";

const publicRouter = Router();

publicRouter.get('/', UserController.getAllUsersHandler);
publicRouter.get('/user/:id', UserController.getUserByIdHandler);
publicRouter.get('/news', UserController.getAllNewsHandler);
publicRouter.get('/news/:id?', UserController.getNewsById);
publicRouter.post('/register', UserController.registerNewUserHandler);
publicRouter.post('/login', UserController.userLoginHandler);

export default publicRouter;
