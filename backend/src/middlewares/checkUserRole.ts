import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../helpers/Errors/api_error";
import { IRequestWithToken } from "../interfaces/IRequestWithToken";
import User, { Roles } from "../models/User";
import { IJwtPayloadUserInfo } from "./IJwtPayloadUserInfo";

export const checkRoleIsAllowed = async (role: string, request: IRequestWithToken, response: Response, next: NextFunction) => {
  if(role == Roles[Roles.READER]) {
    throw new UnauthorizedError("Você não tem permissão para acessar essa rota!");
  }
  next();
}