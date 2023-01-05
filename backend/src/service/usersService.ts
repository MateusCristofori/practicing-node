import bcrypt from 'bcrypt';
import { Request, response, Response } from "express";
import { ApiError, NotFoundError, UnauthorizedError } from "../helpers/Errors/api_error";
import User from "../models/User";
import { Validation } from "../validations/Validations";
import jwt from 'jsonwebtoken';
import News from '../models/News';
import IBlackListToken from '../models/IBlackListToken';
import { generatePasswordHash } from '../helpers/generatePasswordHash/generatePasswordHash';
import { CreateUserDTO } from '../dtos/CreateUserDTO';

export class UserService {
  static getAllUsers = async(request: Request, response: Response) => {
    const users = await User.find({}, '-password');
  
    response.status(200).json(users);
  }

  static getUserById = async(request: Request, response: Response) => {
    const id = request.params.id;

    const user = await User.findById({ _id: id }, '-password');

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

  static getNews = async (request: Request, response: Response) => {
    const news = await News.find({}, 'user_id');
    
    return response.status(200).json({news});
  }

  static getNewsById = async (request: Request, response: Response) => {
    const id = request.params.id;

    const news = await News.findById({ _id: id });

    if(!news) {
      throw new NotFoundError("Notícia não encontrada!");
    }

    response.status(200).json(news);
  }

  static userLogin = async (request: Request, response: Response) => {

    const { email, password }: CreateUserDTO = request.body;
  
    if(!email || !password) {
      throw new ApiError("E-mail ou senha não inseridos", 422);
    }
    
    const user = await User.findOne({email});

    if(!user) {
      throw new NotFoundError("E-mail incorreto!");
    }
  
    const passwordMatch = await bcrypt.compare(password, user.get("password"));
    
    if(!passwordMatch) {
      throw new NotFoundError("Senha incorreta!");
    }
  
    // access token
    const token = jwt.sign({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    }, process.env.SECRET as string, {
      expiresIn: "1d"
    });
    
    const checkValidationToken = await IBlackListToken.findOne({ token });
  
    if(checkValidationToken) {
      throw new UnauthorizedError("Token inválido.");
    }
  
    response.status(200).json({
      auth: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token
    });
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