import { NextFunction, Response } from "express";
import { IRequestWithToken } from "../interfaces/IRequestWithToken";
import User, { Roles } from "../models/User";
import { BadRequestError, UnauthorizedError } from "../helpers/Errors/api_error";

export const checkRoleIsAllowed = async (request: IRequestWithToken, response: Response, next: NextFunction) => {
  if (!request.token) {
    throw new BadRequestError("Token não existente!");
  }
  const user = await User.findById({_id: request.token.user.id});
  
  if(!user) {
    throw new BadRequestError("Usuário não encontrado");
  }

  if(user.role === Roles.READER) {
    throw new UnauthorizedError("Você não está autorizado a realizar essa ação!");
  }
  
  next();
}