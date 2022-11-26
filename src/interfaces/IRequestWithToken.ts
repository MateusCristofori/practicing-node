import { Request } from "express"
import { JwtPayload } from "jsonwebtoken"

export interface IRequestWithToken extends Request {
  token?: JwtPayload;
}