import Router from 'express'
import { dashboardHandler } from '../controllers/privateEndPoint/dashboardHandler';
import { userLogOutHandler } from '../controllers/userLogin';
import { tokenValidation } from '../middlewares/tokenValidation';

const privateRouter = Router()

privateRouter.get('/dashboard', tokenValidation, dashboardHandler);
privateRouter.post('/logout', tokenValidation, userLogOutHandler);

export default privateRouter;