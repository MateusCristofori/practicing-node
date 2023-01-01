import { Request } from "express";
import { IPasswordTokenPayload } from "./IPasswordTokenPayload";

export interface IRequestPasswordRecoveryToken extends Request {
  recoveryToken?: IPasswordTokenPayload
}