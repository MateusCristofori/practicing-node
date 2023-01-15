import { NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';
import { IJwtPayloadUserInfo } from "../../interfaces/IJwtPayloadUserInfo";
import { IRequestWithToken } from "../../interfaces/IRequestWithToken";
import IBlackListToken from "../../models/IBlackListToken";

export const tokenValidation = async (req: IRequestWithToken, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization;
  const token = authToken && authToken.split(" ")[1];
  
  const secret = process.env.SECRET;
  
  const invalidToken = await IBlackListToken.findOne({ token });

  if(invalidToken) {
    return res.status(403).json({ error: "Token inválido!" });
  }

  if(!token || !secret) {
    return res.status(403).json({ error: "Acesso restrito!" });
  }

  req.token = (jwt.verify(token, secret)) as IJwtPayloadUserInfo;
  next();
}