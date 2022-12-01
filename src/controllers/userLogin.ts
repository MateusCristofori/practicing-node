import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { IRequestWithToken } from "../interfaces/IRequestWithToken";
import User from "../models/User";
import IBlackListToken from '../schema/IBlackListToken';

export const userLogin = async (request: Request, response: Response) => {

  const { email, password } =  request.body;

  if(!email || !password) {
    response.status(422).json({msg: "Email ou senha não inseridos."});
    return;
  }
  
  const user = await User.findOne({email});
  
  if(!user) {
    response.status(404).json({msg: "E-mail ou senha incorretos!"});
    return;
  }

  const passwordMatch: Promise<boolean> = bcrypt.compare(password, user.get('password'));
  
  if(!passwordMatch) {
    response.status(404).json({msg: "E-mail ou senha incorretos!"})
    return;
  }

  // access token
  const token = jwt.sign({
    user: {
      name: user.name,
      email: user.email
    }
  }, process.env.SECRET as string, {
    expiresIn: "1d"
  });
  
  const checkValidationToken = await IBlackListToken.findOne({ token })

  if(checkValidationToken) {
    response.status(401).json({msg: "Token inválido!"})
  }

  response.status(200).json({
    auth: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    token,
  });
}

export const userLogOutHandler = (request: IRequestWithToken, response: Response) => {

  const invalidToken = (request.headers['x-access-token'] || request.headers['authorization']) as string
  const token = invalidToken && invalidToken.split(" ")[1]

  const insertInvalidToken = new IBlackListToken({
    token: token
  })

  const blackListToken = insertInvalidToken.save()

  console.log(insertInvalidToken);
  

  response.status(200).json({msg: "Deslogado. Faça o processo de login novamente!"});
}