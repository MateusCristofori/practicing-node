import Router from 'express';
import { ControllerUserAuthenticated } from '../controllers/privateEndPoint/privateActions';
import { UserController } from '../controllers/userController';
import { UserActions } from '../controllers/userLogin';
import { checkRoleIsAllowed } from '../middlewares/checkUserRole';
import { tokenValidation } from '../middlewares/tokenValidation';

const privateRouter = Router();

privateRouter.get('/dashboard', tokenValidation, ControllerUserAuthenticated.dashboardHandler);
privateRouter.get('/news', tokenValidation, ControllerUserAuthenticated.getNews);
privateRouter.post('/news', tokenValidation, checkRoleIsAllowed, ControllerUserAuthenticated.createNews);
privateRouter.post('/logout', tokenValidation, UserActions.userLogOutHandler);
privateRouter.put('/update/:id', UserController.updateUserHandler);
privateRouter.delete('/delete/:id', UserController.deleteUserByIdHandler);

export default privateRouter;