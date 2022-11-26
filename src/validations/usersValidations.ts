import { Request, Response } from "express"
import User from "../models/User";

export const userCredentialValidation = (request: Request, response: Response, name?: String, email?: String, password?: String) => {

  if(!name || !email || !password) {
    response.status(422).json({msg: "Os campos de 'nome', 'email' e 'senha' devem ser preenchidos!"});
    return;
  }
}

export const userExistenceCheck = async (request: Request, response: Response, email: String) => {

  const user = await User.findOne({ email });

  if(user) {
    response.status(422).json({msg: "Já existe um usuário cadastrado com esse e-mail!"});
    return;
  }
}

export const loginCredentialValidation = (request: Request, response: Response, email?: String, password?:String) => {

  if(!email || !password) {
    response.status(422).json({msg: "Os campos de 'email' e 'senha' devem ser preenchidos para o processo de login!"});
    return;
  }

  
}