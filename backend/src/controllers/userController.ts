import { Request, Response } from "express";
import { UserService } from '../service/usersService';

export class UserController {
  static getAllUsersHandler = async (request: Request, response: Response) => {
    UserService.getAllUsers(request, response);
  }

  static getUserByIdHandler = async (request: Request, response: Response) => {
    UserService.getUserById(request, response);
  }

  static registerNewUserHandler = async (request: Request, response: Response) => {
    UserService.registerNewUser(request, response);
  }
  
  static getNewsHandler = async (request: Request, response: Response) => {
    UserService.getNews(request, response);
  }

  static getNewsById = async (request: Request, response: Response) => {
    UserService.getNewsById(request, response);
  }

  static userLoginHandler = async (request: Request, response: Response) => {
    UserService.userLogin(request, response);
  }
}
