import { Request, Response } from "express"
import jwt from 'jsonwebtoken'
import Usermodel from "../models/User"


export const userLogin = async (request: Request, response: Response) => {

  const { email, password } =  request.body;

  if(!email || !password) {
    response.status(422).json({msg: "Email ou senha não inseridos."});
    return;
  }
  
  const user = await Usermodel.findOne({email});
  
  // const passwordHash = bcrypt.hash(password);

  if(!user) {
    response.status(404).json({msg: "Usuário não existe!"});
    return;
  }

  if(password !== user.password) {
    response.status(404).json({msg: "Senha incorreta!"})
    return;
  }

  const token = jwt.sign(user, process.env.SECRET as string);

  response.status(200).json({
    user,
    token
  });
}

export const userLogOut = (request: Request, response: Response) => {
  response.end();
}