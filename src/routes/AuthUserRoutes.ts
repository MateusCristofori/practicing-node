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
  .route("/users/:token?")

  .put(authUserController.updateUser)

  .delete(authUserController.deleteUserByEmail);

authUserRoutes
  .route("/logout")

  .post(authUserController.userLogout);

export default authUserRoutes;
