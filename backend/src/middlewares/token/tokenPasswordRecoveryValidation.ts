import { BadRequestError } from "../../helpers/Errors/api_error";
import { IRequestPasswordRecoveryToken } from "../../interfaces/IRequestWithRecoveryToken"
import jwt from "jsonwebtoken";
import { IPasswordTokenPayload } from "../../interfaces/IPasswordTokenPayload";

export const tokenRecoveryValidation = async (request: IRequestPasswordRecoveryToken) => {

  const bearerToken = request.headers.authorization;
  const token = bearerToken && bearerToken.split(" ")[1];
  
  const secret = process.env.SECRET;

  if(!token || !secret) {
    throw new BadRequestError("Token de recuperação de senha inválido!");
  }

  request.recoveryToken = (jwt.verify(token, secret)) as IPasswordTokenPayload;
}