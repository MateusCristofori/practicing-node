// import's
import bcrypt from 'bcrypt';
import { Request, response, Response } from "express";
import { ApiError } from '../helpers/api_error';
import User from "../models/User";

export class UserController {

  static getAllUsersHandler = async (request: Request, response: Response) => {
    const users = await User.find({}, '-password');
  
    response.status(200).json(users);
  }
  
  static registerNewUserHandler = async (request: Request, response: Response) => {
  
    const { name, email, password } = request.body;
  
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt); // Vamos passar primeiramente a senha e depois o 'salt'.
  
  
    const user = new User({
      name,
      email,
      password: passwordHash
    });
  
    await user.save();
    response.status(201).json(user);
  }
  
  static updateUserHandler = async (request: Request, response: Response) => {
  
    const id = request.params.id;
    const { name, email, password } = request.body;
  
    const salt = await bcrypt.genSalt(12);
    const newPasswordHash = await bcrypt.hash(password, salt);
  
    const user = {
      name,
      email,
      password: newPasswordHash
    };
  
    const updatedUser = await User.findOneAndUpdate({_id: id}, user);
  
    response.status(200).json(user);

    if(!updatedUser) {
      throw new ApiError("Usuário não encontrado", 404);
    }
  }
  
  static deleteUserByIdHandler = async (request: Request, Response: Response) => {
  
    const id = request.params.id;
    
    const deletedUser = await User.findByIdAndDelete({_id: id});

    response.status(200).json({msg: "Usuário deletado com sucesso."});

    if(!deletedUser) {
      response.status(404).json({msg: "Usuário não encontrado! "});
      return;
    }
  }
}
