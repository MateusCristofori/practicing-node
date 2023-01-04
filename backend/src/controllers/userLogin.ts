import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { ApiError, NotFoundError, UnauthorizedError } from '../helpers/Errors/api_error';
import { IRequestWithToken } from "../interfaces/IRequestWithToken";
import User from "../models/User";
import IBlackListToken from '../models/IBlackListToken';

export class UserActions {

  static userLogin = async (request: Request, response: Response) => {

    const { email, password } =  request.body;
  
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
        role: user.role
      },
      token
    });
  }
  
  static userLogOutHandler = (request: IRequestWithToken, response: Response) => {
 
    const invalidToken = request.headers.authorization;
    const token = invalidToken && invalidToken.split(" ")[1];
  
    const insertInvalidToken = new IBlackListToken({
      token: token
    });
  
    const blackListToken = insertInvalidToken.save();
  
    response.status(200).json({msg: "Deslogado. Faça o processo de login novamente!"});
  }
}