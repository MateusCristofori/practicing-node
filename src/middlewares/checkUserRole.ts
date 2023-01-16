import { Roles } from "@prisma/client";
import { NextFunction, Response } from "express";
import { db } from "../database/prisma";
import { IRequestWithToken } from "../interfaces/IRequestWithToken";

export const checkRoleIsAllowed = async (req: IRequestWithToken, res: Response, next: NextFunction) => {
  if (!req.token) {
    return res.status(403).json({ error: "Token de autorização inválido!" });
  }

  const user_id = req.token.user.id;

  const user = await db.user.findFirst({
    where: {
      id: user_id
    },
    select: {
      role: true
    }
  })
  
  if(!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  if(user.role === Roles.READER) {
    return res.status(403).json({ error: "Você não tem autorização para realizar essa ação!" });
  }

  next();
}