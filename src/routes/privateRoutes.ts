import Router from 'express';
import { AuthUserController } from '../controllers/authUserController';
import { checkRoleIsAllowed } from '../middlewares/checkUserRole';
import { tokenValidation } from '../middlewares/token/tokenValidation';

const privateRouter = Router();

privateRouter.get('/dashboard', tokenValidation, AuthUserController.dashboardHandler);
privateRouter.get('/news', tokenValidation, AuthUserController.getUserNewsHandler);
privateRouter.post('/news', tokenValidation, checkRoleIsAllowed, AuthUserController.createNewsHandler);
privateRouter.post('/logout', tokenValidation, AuthUserController.userLogoutHandler);
privateRouter.put('/news/:id', tokenValidation, checkRoleIsAllowed, AuthUserController.updateNewsHandler);
privateRouter.put('/update/:id', AuthUserController.updateUserHandler);
privateRouter.delete('/news/:id', tokenValidation, checkRoleIsAllowed, AuthUserController.deleteNewsHandler);
privateRouter.delete('/delete/:id', AuthUserController.deleteUserByIdHandler);

export default privateRouter;