import Router from 'express';
import { ControllerUserAuthenticated } from '../use-cases/UserAuthenticatedUseCases';
import { UserController } from '../controllers/userController';
import { UserActions } from '../controllers/userLogin';
import { checkRoleIsAllowed } from '../middlewares/checkUserRole';
import { tokenValidation } from '../middlewares/token/tokenValidation';

const privateRouter = Router();

privateRouter.get('/dashboard', tokenValidation, ControllerUserAuthenticated.dashboardHandler);
privateRouter.post('/news', tokenValidation, checkRoleIsAllowed, ControllerUserAuthenticated.createNews);
privateRouter.post('/logout', tokenValidation, UserActions.userLogOutHandler);
privateRouter.put('/update/:id', UserController.updateUserHandler);
privateRouter.delete('/delete/:id', UserController.deleteUserByIdHandler);

export default privateRouter;