import { Response } from "express";
import { IRequestWithToken } from "../interfaces/IRequestWithToken";
import { AuthUserService } from '../use-cases/service/AuthUserService'

export class AuthUserController {
  static dashboard = async (request: IRequestWithToken, response: Response) => {
    AuthUserService.dashboardHandler(request, response);
  }

  static createNews = async (request: IRequestWithToken, response: Response) => {
    AuthUserService.createNewsHandler(request, response);
  }

  // Em desenvolvimento...
  // static getUserNews = async (request: IRequestWithToken, response: Response) => {
  //   return;
  // }

  static userLogout = async (request: IRequestWithToken, response: Response) => {
    AuthUserService.userLogOutHandler(request, response);
  }

  static updateUser = async (request: IRequestWithToken, response: Response) => {
    AuthUserService.updateUserHandler(request, response);
  }

  static deleteUserById = async (request: IRequestWithToken, response: Response) => {
    AuthUserService.deleteUserByIdhandler(request, response);
  }
}