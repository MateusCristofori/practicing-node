import { BadRequestError } from "../helpers/Errors/api_error";

export class Validation {
 
  static checkUserCredentials = (name?: string, email?: string, password?: string, role?: string) => {
    if (!name || !email || !password || !role) {
      throw new BadRequestError("As credenciais do usuário precisam ser preenchidas!");
    }
  }
}