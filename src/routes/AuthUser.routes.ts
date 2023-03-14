import Router from "express";
import AuthUserController from "../controllers/AuthUser.controller";
import { tokenValidation } from "../middlewares/token/tokenValidation";

const authUserRoutes = Router();
authUserRoutes.use(tokenValidation);

// -------- //
const authUserController = new AuthUserController();

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
