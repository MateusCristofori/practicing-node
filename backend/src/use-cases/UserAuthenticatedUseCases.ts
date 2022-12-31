import { Response } from "express"
import { BadRequestError, UnauthorizedError } from "../helpers/Errors/api_error"
import { IRequestWithToken } from "../interfaces/IRequestWithToken"
import User from "../models/User"
import { generatePasswordHash } from "./service/usersService"

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
}
