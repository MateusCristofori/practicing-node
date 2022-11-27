import { JwtPayload } from "jsonwebtoken";
import User from "../models/User";


export interface IJwtPayloadUserInfo extends JwtPayload{
  user: {
    id: string,
    name: string,
    email: string
  }
}