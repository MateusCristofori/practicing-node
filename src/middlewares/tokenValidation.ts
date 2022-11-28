import { NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';
import { IRequestWithToken } from "../interfaces/IRequestWithToken";
import { IJwtPayloadUserInfo } from "./IJwtPayloadUserInfo";
import IBlackListToken from "../schema/IBlackListToken";

export const tokenValidation = async (request: IRequestWithToken, response: Response, next: NextFunction) => {
  try {
    const authToken = (request.headers['x-access-token'] || request.headers['authorization']) as string;
    const token = authToken && authToken.split(" ")[1];
    
    const secret = process.env.SECRET;
    
    const invalidToken = await IBlackListToken.findOne({ token });
    
    if(invalidToken) {
      console.log(invalidToken);
      response.status(403).json({msg: "Token inválido!"});
      return;
    }

    if(!token || !secret) {
      response.status(401).json({msg: "Acesso restrito!"});
      return;
    }
    
    request.token = (jwt.verify(token, secret)) as IJwtPayloadUserInfo;
    next();

  } catch (error) {
    response.status(400).json({msg: "Token inválido!"});
    return;
  }
}