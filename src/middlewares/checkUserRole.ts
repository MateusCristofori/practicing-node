import { NextFunction, Response } from "express";
import { IRequestWithToken } from "../interfaces/IRequestWithToken";
import User, { Roles } from "../models/User";

export const checkRoleIsAllowed = async (req: IRequestWithToken, res: Response, next: NextFunction) => {
  if (!req.token) {
    return res.status(403).json({ error: "Token de autorização inválido!" });
  }

  const userId = req.token.user.id;

  const user = await User.findById({ _id: userId });
  
  if(!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  if(user.role === Roles.READER) {
    return res.status(403).json({ error: "Você não tem permissão para realizar essa ação!" });
  }

  next();
}