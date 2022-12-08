import Router from 'express'
import { dashboardHandler } from '../controllers/privateEndPoint/dashboardHandler';
import { UserController } from '../controllers/userController';
import { UserActions } from '../controllers/userLogin';
import { tokenValidation } from '../middlewares/tokenValidation';

const privateRouter = Router()

privateRouter.get('/dashboard', tokenValidation, dashboardHandler);
privateRouter.post('/logout', tokenValidation, UserActions.userLogOutHandler);
privateRouter.put('/update/:id', UserController.updateUserHandler);
privateRouter.delete('/delete/:id', UserController.deleteUserByIdHandler);

export default privateRouter;