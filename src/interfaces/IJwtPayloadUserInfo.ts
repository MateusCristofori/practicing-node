import { JwtPayload } from "jsonwebtoken";

export interface IJwtPayloadUserInfo extends JwtPayload {
  user: {
    id: string,
    name: string,
    email: string
  }
}