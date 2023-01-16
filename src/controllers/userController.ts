import { Request, Response } from "express";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { generatePasswordHash } from "../helpers/generatePasswordHash/generatePasswordHash";
import News from "../models/News";
import User from "../models/User";
import { Validation } from "../validations/Validations";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import IBlackListToken from "../models/IBlackListToken";

export default class UserController {
  async registerNewUserHandler(req: Request, res: Response) {
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

  async userLoginHandler(req: Request, res: Response) {
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
