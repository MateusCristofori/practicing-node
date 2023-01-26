import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../database/prisma";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { generatePasswordHash } from "../helpers/generatePasswordHash/generatePasswordHash";

export default class UserController {
  async registerNewUserHandler(req: Request, res: Response) {
    const { content }: CreateUserDTO = req.body;

    if(!content) {
      return res.status(404).json({ error: "Precisa-se passar todas as credenciais." });
    }

    const passwordHash = await generatePasswordHash(content.password);

    const newUser = await db.user.create({
      data: {
        name: content.name,
        email: content.email,
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    return res.status(201).json({ newUser });
  }

  async userLoginHandler(req: Request, res: Response) {
    const { email, password } = req.body;
  
    if(!email || !password) {
      return res.status(422).json({ error: "E-mail ou senha não inseridos" });
    }

    const user = await db.user.findFirst({
      where: { email }
    })

    if(!user) {
      return res.status(400).json({ error: "E-mail incorreto!" });
    }
  
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if(!passwordMatch) {
      return res.status(400).json({ error: "Senha incorreta!" })
    }
  
    const token = jwt.sign({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }, process.env.SECRET as string, {
      expiresIn: "1d"
    });
    
    const checkValidationToken = await db.blackListToken.findFirst({
      where: { token }
    })
  
    if(checkValidationToken) {
      return res.status(403).json({ error: "Token inválido!" });
    }
  
    res.status(200).json({
      auth: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token
    });
  }
}
