import { Response } from "express";
import { IRequestWithToken } from "../interfaces/IRequestWithToken";
import { AuthUserService } from '../service/AuthUserService'

export class AuthUserController {
  static dashboardHandler = async (request: IRequestWithToken, response: Response) => {
    AuthUserService.dashboard(request, response);
  }

  static createNewsHandler = async (request: IRequestWithToken, response: Response) => {
    AuthUserService.createNews(request, response);
  }

  static updateNewsHandler = async (request: IRequestWithToken, response: Response) => {
    AuthUserService.updateNews(request, response);
  }

  static getUserNewsHandler = async (request: IRequestWithToken, response: Response) => {
    AuthUserService.getUserNews(request, response);
  }

  static userLogoutHandler = async (request: IRequestWithToken, response: Response) => {
    AuthUserService.userLogOut(request, response);
  }

  static updateUserHandler = async (request: IRequestWithToken, response: Response) => {
    AuthUserService.updateUserHandler(request, response);
  }

  static deleteUserByIdHandler = async (request: IRequestWithToken, response: Response) => {
    AuthUserService.deleteUserById(request, response);
  }

  static deleteNewsHandler = async (request: IRequestWithToken, response: Response) => {
    AuthUserService.deleteNews(request, response);
  }
}