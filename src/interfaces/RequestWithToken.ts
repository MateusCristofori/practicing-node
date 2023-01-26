import { Request } from "express";
import { JwtPayloadUserInfo } from "./JwtPayloadUserInfo";

export interface RequestWithToken extends Request {
  token?: JwtPayloadUserInfo;
}