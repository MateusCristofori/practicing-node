import Router from 'express';
import { AuthUserController } from '../controllers/authUserController';
import { checkRoleIsAllowed } from '../middlewares/checkUserRole';
import { tokenValidation } from '../middlewares/token/tokenValidation';
import { AuthUserService } from '../service/AuthUserService';

const privateRouter = Router();

privateRouter.get('/dashboard', tokenValidation, AuthUserController.dashboardHandler);
privateRouter.get('/news', tokenValidation, AuthUserService.getUserNews);
privateRouter.post('/news', tokenValidation, checkRoleIsAllowed, AuthUserController.createNewsHandler);
privateRouter.post('/logout', tokenValidation, AuthUserController.userLogoutHandler);
privateRouter.put('/update/:id', AuthUserController.updateUserHandler);
privateRouter.delete('/delete/:id', AuthUserController.deleteUserByIdHandler);

export default privateRouter;