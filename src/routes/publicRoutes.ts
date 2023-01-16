import { Router } from "express";
import UserController from "../controllers/userController";

const publicRouter = Router();

// ------ //
const userController = new UserController();


publicRouter.get('/user/:id', userController.getUserByIdHandler);
publicRouter.get('/news', userController.getAllNewsHandler);
publicRouter.get('/news/:id?', userController.getNewsById);
publicRouter.post('/register', userController.registerNewUserHandler);
publicRouter.post('/login', userController.userLoginHandler);

export default publicRouter;
