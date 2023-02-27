import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../database/prisma";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import UserLoginDTO from "../dtos/UserLoginDTO";
import CheckValidateToken from "../helpers/checkValidateToken/CheckValidateToken";
import { generatePasswordHash } from "../helpers/generatePasswordHash/generatePasswordHash";

export default class UserController {
  async registerNewUserHandler(req: Request, res: Response) {
    const { content }: CreateUserDTO = req.body;

    if (!content) {
      return res
        .status(404)
        .json({ error: "Precisa-se passar todas as credenciais." });
    }

    if (!content.email.includes("@")) {
      return res
        .status(400)
        .json({ error: "Deve-se passar o e-mail e senha!" });
    }

    const newUser = await db.user.create({
      data: {
        name: content.name,
        email: content.email,
        password: await generatePasswordHash(content.password),
      },
    });

    return res.status(201).json({ newUser });
  }

  async userLoginHandler(req: Request, res: Response) {
    const { content }: UserLoginDTO = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ error: "Deve-se passar o e-mail e senha!" });
    }

    if (!content.email.includes("@")) {
      return res.status(400).json({ error: "O email precisa ser válido!" });
    }

    const user = await db.user.findFirst({
      where: {
        email: content.email,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "E-mail incorreto!" });
    }

    const passwordMatch = await bcrypt.compare(content.password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Senha incorreta!" });
    }

    const token = jwt.sign(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      process.env.SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    const isValidToken = CheckValidateToken.isTokenValid(token);

    if (!isValidToken) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    res.status(200).json({
      auth: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  }
}
