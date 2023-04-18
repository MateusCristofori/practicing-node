import Router from "express";
import AuthUserController from "../controllers/AuthUser.controller";
import { tokenValidation } from "../middlewares/tokenValidation";

const authUserRoutes = Router();
authUserRoutes.use(tokenValidation);

// -------- //

const authUserController = new AuthUserController();

authUserRoutes.route("/dashboard").get(authUserController.dashboard);

// TODO: token should be secret. maybe we should discuss changing these route params to /:id or /:username
authUserRoutes.route("/update/:token").put(authUserController.updateUser);

authUserRoutes
  .route("/delete/:token")
  .post(authUserController.deleteUserByEmail)
  .delete(authUserController.deletedUser);

authUserRoutes.route("/logout").post(authUserController.userLogout);

export default authUserRoutes;
