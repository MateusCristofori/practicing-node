import { Request } from "express";
import { JwtPayloadUser } from "./JwtPayloadUser";

export interface RequestWithToken extends Request {
  token?: JwtPayloadUser;
}
