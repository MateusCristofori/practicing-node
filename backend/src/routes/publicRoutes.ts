import { Router } from "express";
import { UserController } from "../controllers/userController";

const publicRouter = Router();

publicRouter.get('/', UserController.getAllUsersHandler);
publicRouter.get('/user/:id', UserController.getUserByIdHandler);
publicRouter.post('/register', UserController.registerNewUserHandler);
publicRouter.post('/login', UserController.userLoginHandler);
publicRouter.get('/news', UserController.getNewsHandler);
publicRouter.get('/news/:id?', UserController.getNewsById);

export default publicRouter;
