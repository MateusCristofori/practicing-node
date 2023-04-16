import { Router } from "express";
import NewsController from "../controllers/News.controller";
import { checkRoleIsAllowed } from "../middlewares/checkUserRole";
import { tokenValidation } from "../middlewares/tokenValidation";

const newsRoutes = Router();
newsRoutes.use(tokenValidation);

// ---------- //
const newsController = new NewsController();

newsRoutes
  .route("/news")
  .get(newsController.listNews)
  .post(checkRoleIsAllowed, newsController.createNews)

newsRoutes
  .route("/news/:name")
  .get(newsController.retrieveNews)
  .put(newsController.updateNews)
  .delete(newsController.deleteNews);

export default newsRoutes;
