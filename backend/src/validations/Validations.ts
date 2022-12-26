import { BadRequestError } from "../helpers/api_error";

export class Validation {
 
  static checkUserCredentials = (name?: string, email?: string, password?: string) => {
    if (!name || !email || !password) {
      throw new BadRequestError("As credenciais do usuário precisam ser preenchidas!");
    }

  }
  
}