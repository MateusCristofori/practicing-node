import { Response } from "express"
import { IRequestWithToken } from "../../interfaces/IRequestWithToken"

export class ActionsWithUserAuthenticated {
  static dashboardHandler = async (request: IRequestWithToken, response: Response) => {
    return response.status(200).json({msg: "Seja bem-vindo ao dashboard!", token: request.token})
  }

  static getNews = async (request: IRequestWithToken, response: Response) => {
    return response.status(200).json({news: "Notícia de teste"})
  }

  static createNews = async (request: IRequestWithToken, response: Response) => {
    return response.status(200).send("Nova notícia criada.")
  }
}
