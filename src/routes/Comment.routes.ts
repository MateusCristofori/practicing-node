import { Router } from "express";
import CommentController from "../controllers/Comment.controller";
import { tokenValidation } from "../middlewares/token/tokenValidation";

const commentRouter = Router();
commentRouter.use(tokenValidation);
//-------- //

const commentController = new CommentController();
