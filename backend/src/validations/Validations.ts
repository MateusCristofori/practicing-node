import { BadRequestError } from "../helpers/Errors/api_error";

export class Validation {
  static checkUserName = (name: string) => {
    if (!name) {
      throw new BadRequestError("Campo 'nome' deve ser preenchido!");
    }
  }

  static checkUserEmail = (email: string) => {
    if(!email) {
      throw new BadRequestError("Campo 'email' deve ser preenchido!");
    }
  }

  static checkUserPassword = (password: string) => {
    if(!password) {
      throw new BadRequestError("Campo 'senha' deve ser preenchido!");
    }
  }
}