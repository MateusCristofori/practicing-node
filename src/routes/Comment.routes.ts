import { Router } from "express";
import { tokenValidation } from "../middlewares/tokenValidation";

const commentRouter = Router();
commentRouter.use(tokenValidation);
//-------- //

//const commentController = new CommentController();
