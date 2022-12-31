import { Request, Response } from "express";
import { UserService } from '../use-cases/service/usersService';

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
  
  static updateUserHandler = async (request: Request, response: Response) => {
    UserService.updateUser(request, response);
  }
  
  static deleteUserByIdHandler = async (request: Request, response: Response) => {
    UserService.deleteUserById(request, response);
  }
}
