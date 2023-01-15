import { Request, Response } from "express";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { generatePasswordHash } from "../helpers/generatePasswordHash/generatePasswordHash";
import News from "../models/News";
import User from "../models/User";
import { Validation } from "../validations/Validations";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import IBlackListToken from "../models/IBlackListToken";

export class UserController {
  static getAllUsersHandler = async (req: Request, res: Response) => {
    const users = await User.find({}, '-password');
  
    res.status(200).json({ users });
  }

  static getUserByIdHandler = async (req: Request, res: Response) => {
    const id = req.params.id;

    const user = await User.findById({ _id: id }, '-password');

    if(!user) {
      return res.status(404).json({ error: "Usuário não encontrado!" });
    }
    
    res.status(200).json({ user });
  }

  static registerNewUserHandler = async (req: Request, res: Response) => {
    const { name, email, password }: CreateUserDTO = req.body;

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
    res.status(201).json({ user });
  }
  
  static getAllNewsHandler = async (req: Request, res: Response) => {
    const news = await News.find({}, '-user_id');
    
    return res.status(200).json({ news });
  }

  static getNewsById = async (req: Request, res: Response) => {
    const id = req.params.id;

    const news = await News.findById({ _id: id });

    if(!news) {
      return res.status(404).json({ error: "Notícia não encontrada!" });
    }

    res.status(200).json({ news });
  }

  static userLoginHandler = async (req: Request, res: Response) => {
    const { email, password }: CreateUserDTO = req.body;
  
    if(!email || !password) {
      return res.status(422).json({ error: "E-mail ou senha não inseridos" });
    }
    
    const user = await User.findOne({ email });

    if(!user) {
      return res.status(400).json({ error: "E-mail incorreto!" });
    }
  
    const passwordMatch = await bcrypt.compare(password, user.get("password"));
    
    if(!passwordMatch) {
      return res.status(400).json({ error: "Senha incorreta!" })
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
      return res.status(403).json({ error: "Token inválido!" });
    }
  
    res.status(200).json({
      auth: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token
    });
  }
}
