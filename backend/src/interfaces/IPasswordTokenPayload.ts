import { JwtPayload } from "jsonwebtoken";

export interface IPasswordTokenPayload extends JwtPayload {
  user: {
    id: string,
    email: string
  }
}