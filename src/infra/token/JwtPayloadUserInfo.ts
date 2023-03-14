import { JwtPayload } from "jsonwebtoken";

export interface JwtPayloadUserInfo extends JwtPayload {
  user: {
    id: string,
    name: string,
    email: string
  }
}