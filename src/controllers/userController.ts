import  User from "../models/User"
import { Request, Response } from "express";

export const getAllUsersHandler = async (request: Request, response: Response) => {

  const users = await User.find({});

  response.status(200).json(users)
}