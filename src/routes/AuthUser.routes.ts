import Router from "express";
import AuthUserController from "../controllers/AuthUser.controller";
import { blackListTokenInstance } from "../infra/repositories/BlackListTokenRepository";
import { newsRepositoryInstance } from "../infra/repositories/NewsRepository";
import { userRepositoryInstance } from "../infra/repositories/UserRepository";
import { tokenValidation } from "../middlewares/token/tokenValidation";

const authUserRoutes = Router();
authUserRoutes.use(tokenValidation);

// -------- //

const authUserController = new AuthUserController(
  userRepositoryInstance,
  newsRepositoryInstance,
  blackListTokenInstance
);

authUserRoutes

  .route("/dashboard")

  .get(authUserController.dashboard);

authUserRoutes

  .route("/update/:token?")

  .put(authUserController.updateUser);

authUserRoutes

  .route("/delete/:token?")

  .post(authUserController.deleteUserByEmail)

  .delete(authUserController.deletedUser);

authUserRoutes

  .route("/logout")

  .post(authUserController.userLogout);

export default authUserRoutes;
