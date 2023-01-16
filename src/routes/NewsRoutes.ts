import { Router } from "express";
import NewsController from "../controllers/NewsController";
import { checkRoleIsAllowed } from "../middlewares/checkUserRole";
import { tokenValidation } from "../middlewares/token/tokenValidation";

const newsRoutes = Router();
newsRoutes.use(tokenValidation);
newsRoutes.use(checkRoleIsAllowed);

// ---------- //
const newsController = new NewsController();

newsRoutes.route("/news/:id?")

  .get(newsController.listNews)

  .get(newsController.retrieveNews)

  .post(newsController.createNews)

  .put(newsController.updateNews)

  .delete(newsController.deleteNews);

export default newsRoutes;