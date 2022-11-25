// import's
import  User from "../models/User"
import { Request, response, Response } from "express";
import bcrypt from 'bcrypt';

// functions
export const getAllUsersHandler = async (request: Request, response: Response) => {

  const users = await User.find({});

  response.status(200).json(users);
}

export const registerNewUserHandler = async (request: Request, response: Response) => {

  const { name, email, password } = request.body;

  const salt = await bcrypt.genSalt(12);
  const passwordHash = bcrypt.hash(salt, password);


  const user = new User({
    name,
    email,
    password: passwordHash
  });

  await user.save();
  response.status(201).json(user);
}

export const updateUserHandler = async (request: Request, response: Response) => {

  const id = request.params.id;
  const { name, email, password} = request.body;

  const salt = await bcrypt.genSalt(12);
  const newPasswordHash = bcrypt.hash(salt, password);

  const user = {
    name,
    email,
    password: newPasswordHash
  };

  const updatedUser = User.findOne({ _id: id }, user);

  response.status(200).json(user);
}

export const deleteUserByIdHandler = async (request: Request, Response: Response) => {
  
  try {
    const id = request.params.id;
    
    const deletedUser = await User.deleteOne({_id: id});

    response.status(200).json({msg: "Usuário deletado com sucesso."});

  } catch (error) {
    response.status(404).json({msg: "Usuário não encontrado! "});
    return;
  }
}