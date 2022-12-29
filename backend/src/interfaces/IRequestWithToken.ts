import { Request } from "express";
import { IJwtPayloadUserInfo } from "../middlewares/IJwtPayloadUserInfo";


export interface IRequestWithToken extends Request {
  token?: IJwtPayloadUserInfo;
}