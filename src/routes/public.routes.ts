import "reflect-metadata";
import { Router } from "express";
import { UserController } from "../controllers/User.controller";

const publicRouter = Router();

// ------ //
const userController = new UserController();

publicRouter
  .route("/register")

  .post(userController.registerNewUserHandler);

publicRouter
  .route("/login")

  .post(userController.userLoginHandler);

publicRouter
  .route("/recover/:token?")

  .post(userController.passwordRecover)

  .put(userController.changePassword);

export default publicRouter;
