import { JwtPayload } from "jsonwebtoken";

export interface JwtPayloadUser extends JwtPayload {
  user: {
    id: string;
    name: string;
    email: string;
  };
}
