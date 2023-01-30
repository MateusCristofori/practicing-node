import { randomUUID } from "crypto";
import { Response } from "express";
import { db } from "../database/prisma";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { generatePasswordHash } from "../helpers/generatePasswordHash/generatePasswordHash";
import { RequestWithToken } from "../interfaces/RequestWithToken";

export default class AuthUserController {
  async dashboard(req: RequestWithToken, res: Response) {
    if(!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const user_id = req.token.user.id;

    const userNews = await db.news.findMany({
      where: {
        userId: user_id
      },
      include: {
        post: true
      }
    });

    if(!userNews) {
      return res.status(404).json({ error: "Você ainda não possui nenhuma notícia cadastrada." });
    }

    return res.status(200).json({ userNews });
  }

  async updateUser(req: RequestWithToken, res: Response) {
    if(!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const user_id = req.token.user.id;

    const { content }: CreateUserDTO = req.body;

    const updatedUser = await db.user.update({
      where: {
        id: user_id
      },
      data: {
        name: content.name,
        email: content.email,
        password: content.password
      }
    });

    return res.status(204).json({ updatedUser });
  }

  async deleteUserById(req: RequestWithToken, res: Response) {
    if(!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const user_id = req.token.user.id;

    const deletedUser = await db.user.delete({
      where: {
        id: user_id
      }
    });

    return res.status(200).json({ deletedUser });
  }

  async passwordRecover(req: RequestWithToken, res: Response) {
    if(!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }
    
    const { email } = req.body;

    const user = await db.user.findFirst({
      where: {
        email
      }
    });

    if(!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    if(user.email != req.token.user.email) {
      return res.status(403).json({ error: "Não é permitido mudar a senha de outro usuário." });
    }

    const passwordToken = await db.recoverToken.create({
      data: {
        userId: user.id,
        token: randomUUID(),
        used: false        
      }
    });

    const token = passwordToken.token;
    return res.json({ token });
  }

  async changePassword(req: RequestWithToken, res: Response) {
    if(!req.token) {
      return res.status(403).json({ error: "token de autorização inválido."});
    }

    const { newPassword } = req.body;

    const checkUserPassword = await db.user.findFirst({
      where: {
        id: req.token.user.id,
        password: newPassword
      }
    });

    if(checkUserPassword) {
      return res.status(400).json({ error: "As senhas não podem ser iguais." });
    }

    const token = req.params.token;

    const existsPasswordToken = await db.recoverToken.findFirst({
      where: {
        token: token
      }
    });

    if(!existsPasswordToken) {
      return res.status(404).json({ error: "Token de recuperação não encontrado." });
    }

    if(existsPasswordToken.used) {
      return res.status(403).json({ error: "Token de recuperação inválido para uso." });
    }

    const user = await db.user.update({
      where: {
        id: req.token.user.id
      },
      data: {
        password: await generatePasswordHash(newPassword),
      }
    });

    return res.status(200).json({ user });
  }

  async userLogout(req: RequestWithToken, res: Response) {
    const invalidToken = req.headers.authorization;
    const token = invalidToken && invalidToken.split(" ")[1];

    if(!token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const blackToken = await db.blackListToken.create({
      data: {
        token
      }
    });

    res.status(200).json({ msg: "Deslogado. Necessário logar novamente!" });
  }
}
