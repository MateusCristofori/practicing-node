import { Request, Response } from "express";
import { ApiError, NotFoundError } from "../helpers/api_error";
import User from "../models/User";
import { IUserRequestBody } from "../user-request-body/IUser-request-body";
import bcrypt from 'bcrypt';

export class UserService {

  static getAllUsers = async(request: Request, response: Response) => {
    const users = await User.find({}, '-password');
  
    response.status(200).json(users);
  }

  static getUserById = async(request: Request, response: Response) => {
    const id = request.query['id'];

    const user = User.findById({_id: id});

    if(!user) {
      throw new NotFoundError("Usuário não encontrado!");
    }
    
    response.status(200).json(user);
  }

  static registerNewUser = async(request: Request, response: Response) => {
    const { name, email, password }: IUserRequestBody = request.body;

    if(!name || !email || !password) {
      throw new ApiError("Os campos de 'nome', 'email', 'senha' e 'permissão' precisam ser preenchidos.", 500)
    }

    const salt: string = await bcrypt.genSalt(12);
    const passwordHash: string = await bcrypt.hash(password, salt); // Vamos passar primeiramente a senha e depois o 'salt'.
  
    const user = new User({
      name,
      email,
      password: passwordHash
    });
  
    await user.save();
    response.status(201).json(user);
  }

  static updateUser = async(request: Request, response: Response) => {
    const id: string = request.params.id;
    if(!id) {
      throw new NotFoundError("Usuário não encontrado!");
    }

    const { name, email, password }: IUserRequestBody = request.body;
    if(!name || !email || !password) {
      throw new ApiError("Os campos de 'nome', 'email' e 'senha' precisam ser preenchidos.", 500);
    }

    const salt: string = await bcrypt.genSalt(12);
    const newPasswordHash: string = await bcrypt.hash(password, salt);
  
    const user = {
      name,
      email,
      password: newPasswordHash
    };
  
    const updatedUser = await User.findOneAndUpdate({_id: id}, user);
  
    response.status(200).json(user);

    if(!updatedUser) {
      throw new NotFoundError("Usuário não encontrado!");
    }
  }

  static deleteUserById = async(request: Request, response: Response) => {

    const id: string = request.params.id;
    
    const deletedUser = await User.findByIdAndDelete({_id: id});

    response.status(200).json({msg: "Usuário deletado com sucesso."});

    if(!deletedUser) {
      throw new NotFoundError("Usuário não encontrado!");
    }
  }
}