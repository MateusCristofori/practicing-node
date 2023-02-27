import Router from "express";
import AuthUserController from "../controllers/AuthUserController";
import { tokenValidation } from "../middlewares/token/tokenValidation";

const authUserRoutes = Router();
authUserRoutes.use(tokenValidation);

// -------- //
const authUserController = new AuthUserController();

authUserRoutes
  .route("/dashboard")

  .get(authUserController.dashboard);

authUserRoutes
  .route("/users/:id?")

  .put(authUserController.updateUser)

  .delete(authUserController.deleteUserById);

authUserRoutes
  .route("/logout")

  .post(authUserController.userLogout);

authUserRoutes
  .route("/recover/:token?")

  .post(authUserController.passwordRecover)

  .put(authUserController.changePassword);

export default authUserRoutes;
