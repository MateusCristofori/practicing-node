import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from "../models/User";
import bcrypt from 'bcrypt';
import { IRequestWithToken } from "../interfaces/IRequestWithToken";

export const userLogin = async (request: Request, response: Response) => {

  const { email, password } =  request.body;

  if(!email || !password) {
    response.status(422).json({msg: "Email ou senha não inseridos."});
    return;
  }
  
  const user = await User.findOne({email});
  
  
  if(!user) {
    response.status(404).json({msg: "Usuário não existe!"});
    return;
  }

  const passwordHash: Promise<boolean> = bcrypt.compare(password, user.get('password'));
  
  if(!passwordHash) {
    response.status(404).json({msg: "Senha incorreta!"})
    return;
  }

  const token = jwt.sign({
    user: {
      name: user.name,
      email: user.email
    }
  }, process.env.SECRET as string);

  response.status(200).json({
    auth: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    token
  });
}

const blackListToken: string[] = []

export const userLogOutHandler = (request: IRequestWithToken, response: Response) => {
  const { token } = request.body

  const invalidToken = blackListToken.push(token)
  console.log(blackListToken);
  
  response.end().json({msg: "Deslogado."});
}