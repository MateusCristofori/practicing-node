import { Response } from "express"
import { BadRequestError, UnauthorizedError } from "../../helpers/Errors/api_error"
import { IRequestWithToken } from "../../interfaces/IRequestWithToken"
import User from "../../models/User"
import { generatePasswordHash } from "../../services/usersService"

export class ControllerUserAuthenticated {
  static dashboardHandler = async (request: IRequestWithToken, response: Response) => {
    return response.status(200).json({msg: "Seja bem-vindo ao dashboard!", token: request.token})
  }

  static getNews = async (request: IRequestWithToken, response: Response) => {
    return response.status(200).json({news: "Notícia de teste"})
  }

  static createNews = async (request: IRequestWithToken, response: Response) => {
    return response.status(200).send("Nova notícia criada.")
  }

  static passwordRecovery = async (request: IRequestWithToken, response: Response) => {
    if(!request.token) {
      throw new UnauthorizedError("O token deve ser inválido!");
    }
    
    const userEmail = request.token?.user.email;
    const password = request.body;

    const newPassword = await generatePasswordHash(password);

    if(!newPassword) {
      throw new BadRequestError("A nova senha precisa ser informada!");
    }

    const updateUser = User.findOneAndUpdate({email: userEmail, password: newPassword});

    return response.status(200).json({msg: "Senha alterada com sucesso!", user: updateUser});
  }
}
