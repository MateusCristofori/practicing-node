import Router from 'express';
import AuthUserController from '../controllers/authUserController';
import { tokenValidation } from '../middlewares/token/tokenValidation';

const authUserRoutes = Router();
authUserRoutes.use(tokenValidation);

// -------- //
const authUserController = new AuthUserController();

authUserRoutes.route("/dashboard")

  .get(authUserController.dashboard)

authUserRoutes.route("/users/:id?")

  .put(authUserController.updateUser)

  .delete(authUserController.deleteUserById)


export default authUserRoutes;