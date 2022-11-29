import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from "../models/User";
import bcrypt from 'bcrypt';
import { IRequestWithToken } from "../interfaces/IRequestWithToken";
import IBlackListToken from "../schema/IBlackListToken";

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

  const passwordMatch: Promise<boolean> = bcrypt.compare(password, user.get('password'));
  
  if(!passwordMatch) {
    response.status(404).json({msg: "Senha incorreta!"})
    return;
  }

  const token = jwt.sign({
    user: {
      name: user.name,
      email: user.email
    }
  }, process.env.SECRET as string, {
    subject: user._id,
    expiresIn: "20s"
  });

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

export const userLogOutHandler = (request: IRequestWithToken, response: Response) => {
  const { token } = request.body

  try {
    const addTokenInBlackList = IBlackListToken.bulkSave([token])
    
    console.log("Token salvo na black list", token);
  } catch (error) {
    console.log("Token não salvo na black list");
  }
  response.status(200).json({msg: "Deslogado."}).end();
}