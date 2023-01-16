import Router from 'express';
import AuthUserController from '../controllers/authUserController';
import { tokenValidation } from '../middlewares/token/tokenValidation';

const privateRouter = Router();

// -------- //
const authUserController = new AuthUserController();


privateRouter.get('/dashboard', tokenValidation, authUserController.dashboardHandler);
privateRouter.post('/logout', tokenValidation, authUserController.userLogoutHandler);
privateRouter.put('/update/:id', authUserController.updateUserHandler);
privateRouter.delete('/delete/:id', authUserController.deleteUserByIdHandler);

export default privateRouter;