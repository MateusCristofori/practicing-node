import { Router } from "express";
import UserController from "../controllers/UserController";

const publicRouter = Router();

// ------ //
const userController = new UserController();

publicRouter
  .route("/register")

  .post(userController.registerNewUserHandler);

publicRouter
  .route("/login")

  .post(userController.userLoginHandler);

export default publicRouter;
