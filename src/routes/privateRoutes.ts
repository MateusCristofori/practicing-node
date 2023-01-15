import Router from 'express';
import { AuthUserController } from '../controllers/authUserController';
import NewsController from '../controllers/NewsController';
import { checkRoleIsAllowed } from '../middlewares/checkUserRole';
import { tokenValidation } from '../middlewares/token/tokenValidation';

const privateRouter = Router();

// -------- //
const newsController = new NewsController();


privateRouter.get('/dashboard', tokenValidation, AuthUserController.dashboardHandler);
privateRouter.get('/news', tokenValidation, newsController.getNewsHandler);
privateRouter.post('/news', tokenValidation, checkRoleIsAllowed, AuthUserController.createNewsHandler);
privateRouter.post('/logout', tokenValidation, AuthUserController.userLogoutHandler);
privateRouter.put('/news/:id', tokenValidation, checkRoleIsAllowed, newsController.updateNews);
privateRouter.put('/update/:id', AuthUserController.updateUserHandler);
privateRouter.delete('/news/:id', tokenValidation, checkRoleIsAllowed, newsController.deleteNewsHandler);
privateRouter.delete('/delete/:id', AuthUserController.deleteUserByIdHandler);

export default privateRouter;