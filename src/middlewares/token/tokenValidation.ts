import { NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';
import { db } from "../../database/prisma";
import { IJwtPayloadUserInfo } from "../../interfaces/IJwtPayloadUserInfo";
import { IRequestWithToken } from "../../interfaces/IRequestWithToken";

export const tokenValidation = async (req: IRequestWithToken, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization;
  const token = authToken && authToken.split(" ")[1];
  
  const secret = process.env.SECRET;
  
  const invalidToken = await db.blackListToken.findFirst({
    where: {
      token
    }
  })

  if(invalidToken) {
    return res.status(403).json({ error: "Token inválido!" });
  }

  if(!token || !secret) {
    return res.status(403).json({ error: "Acesso restrito!" });
  }

  req.token = (jwt.verify(token, secret)) as IJwtPayloadUserInfo;
  next();
}