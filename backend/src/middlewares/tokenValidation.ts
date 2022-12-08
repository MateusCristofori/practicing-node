import { NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from "../helpers/api_error";
import { IRequestWithToken } from "../interfaces/IRequestWithToken";
import IBlackListToken from "../schema/IBlackListToken";
import { IJwtPayloadUserInfo } from "./IJwtPayloadUserInfo";

export const tokenValidation = async (request: IRequestWithToken, response: Response, next: NextFunction) => {
  const authToken = request.headers.authorization;
  const token = authToken && authToken.split(" ")[1];
  
  const secret = process.env.SECRET;
  
  const checkToken = await IBlackListToken.findOne({ token });

  if(checkToken) {
    throw new UnauthorizedError("Token inválido!");
  }

  if(!token || !secret) {
    throw new UnauthorizedError("Acesso restrito!");
  }

  request.token = (jwt.verify(token, secret)) as IJwtPayloadUserInfo;
  next();
}