import { Router } from "express";
import { getAllUsersHandler } from "../controllers/userController";


const router = Router();


router.get('/', getAllUsersHandler) ;


export default router;