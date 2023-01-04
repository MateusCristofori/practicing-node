import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { NotFoundError } from "../../helpers/Errors/api_error";
import User from "../../models/User";
import { CreateUserDTO } from "../../user-request-body/createUserDTO";
import { Validation } from "../../validations/Validations";
import jwt from 'jsonwebtoken';
import News from '../../models/News';

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
    const { name, email, password }: CreateUserDTO = request.body;

    Validation.checkUserEmail(email);
    Validation.checkUserName(name);
    Validation.checkUserPassword(password);

    const passwordHash = await generatePasswordHash(password);

    const user = new User({
      name,
      email,
      password: passwordHash,
    });
    
    await user.save();
    response.status(201).json(user);
  }

  static updateUser = async(request: Request, response: Response) => {
    const id: string = request.params.id;
    
    if(!id) {
      throw new NotFoundError("Usuário não encontrado!");
    }

    const { name, email, password }: CreateUserDTO = request.body;

    Validation.checkUserEmail(email);
    Validation.checkUserName(name);
    Validation.checkUserPassword(password);

   const newPasswordHash = await generatePasswordHash(password);

    const user = {
      name,
      email,
      password: newPasswordHash
    };
  
    const updatedUser = await User.findOneAndUpdate({_id: id}, user);
    
    if(!updatedUser) {
      throw new NotFoundError("Usuário não encontrado!");
    }
  
    response.status(200).json(user);
  }

  static deleteUserById = async(request: Request, response: Response) => {

    const id: string = request.params.id;
    
    const deletedUser = await User.findByIdAndDelete({_id: id});

    if(!deletedUser) {
      throw new NotFoundError("Usuário não encontrado!");
    }

    response.status(200).json({msg: "Usuário deletado com sucesso."});
  }

  static getNews = async (request: Request, response: Response) => {
    const news = News.find({});

    return response.status(200).json({news});
  }

  // static passwordRecovery = async (request: Request, response: Response) => {
  //   const userEmail = request.body;
  //   const password = request.body;

  //   Validation.checkUserEmail(userEmail);

  //   const user = await User.findOne({ email: userEmail });

  //   if(!user) {
  //     throw new NotFoundError("Usuário não encontrado!");
  //   }

  //   const newPassword = await generatePasswordHash(password);

  //   const token = jwt.sign({
  //     user: {
  //       id: user._id,
  //       email: user.email
  //     }
  //   }, process.env.SECRET as string);

  //   const updateUser = await User.findOneAndUpdate({email: userEmail, password: newPassword});

  //   response.status(200).json({msg: "Senha alterada com sucesso!", user: updateUser});
  // }
}

export const generatePasswordHash = async(password: string) => {
  const salt: string = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
}