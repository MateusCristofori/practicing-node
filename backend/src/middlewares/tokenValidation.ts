import { NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';
import { IRequestWithToken } from "../interfaces/IRequestWithToken";
import IBlackListToken from "../schema/IBlackListToken";
import { IJwtPayloadUserInfo } from "./IJwtPayloadUserInfo";

export const tokenValidation = async (request: IRequestWithToken, response: Response, next: NextFunction) => {
  try {
    const authToken = (request.headers['x-access-token'] || request.headers['authorization']) as string;
    const token = authToken && authToken.split(" ")[1];
    
    const secret = process.env.SECRET;
    const refreshToken = process.env.REFRESH_TOKEN;
    
    const checkToken = await IBlackListToken.findOne({ token })

    if(checkToken) {
      response.status(401).json({msg: "Token inválido!"})
    }

    if(!token || !secret) {
      response.status(401).json({msg: "Acesso restrito!"});
      return;
    }

    request.token = (jwt.verify(token, secret)) as IJwtPayloadUserInfo;
    request.token = (jwt.verify(token, refreshToken as string)) as IJwtPayloadUserInfo;
    next();

  } catch (error) {
    response.status(400).json({msg: "Token inválido!"});
    console.log(error);
    return;
  }
}