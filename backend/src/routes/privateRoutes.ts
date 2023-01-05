import Router from 'express';
import { AuthUserController } from '../controllers/authUserController';
import { checkRoleIsAllowed } from '../middlewares/checkUserRole';
import { tokenValidation } from '../middlewares/token/tokenValidation';

const privateRouter = Router();

privateRouter.get('/dashboard', tokenValidation, AuthUserController.dashboard);
privateRouter.post('/news', tokenValidation, checkRoleIsAllowed, AuthUserController.createNews);
privateRouter.post('/logout', tokenValidation, AuthUserController.userLogout);
privateRouter.put('/update/:id', AuthUserController.updateUser);
privateRouter.delete('/delete/:id', AuthUserController.deleteUserById);

export default privateRouter;