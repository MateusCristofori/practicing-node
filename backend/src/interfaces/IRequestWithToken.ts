import { Request } from "express";
import { IJwtPayloadUserInfo } from "./IJwtPayloadUserInfo";

export interface IRequestWithToken extends Request {
  token?: IJwtPayloadUserInfo;
}