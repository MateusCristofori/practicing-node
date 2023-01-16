import { Router } from "express";
import UserController from "../controllers/userController";

const publicRouter = Router();

// ------ //
const userController = new UserController();


publicRouter.post('/register', userController.registerNewUserHandler);
publicRouter.post('/login', userController.userLoginHandler);

export default publicRouter;
