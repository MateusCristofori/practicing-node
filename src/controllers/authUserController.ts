import { Response } from "express";
import { json } from "stream/consumers";
import { db } from "../database/prisma";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { createPasswordRecoverToken } from "../helpers/createPasswordRecoverToken/createPasswordRecoverToken";
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
        name: content?.name,
        email: content?.email,
        password: content?.password
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
      return res.status(403).json({ error: "token de autorização inválido."});
    }
  
    const recoverToken = req.params.token;

    if(!recoverToken) {
      return res.status(400).json({ error: "Token de recuperação inválido." });
    }

    const token = await db.recoverToken.findFirst({
      where: {
        token: recoverToken
      }
    });

    if(!token) {
      return res.status(400).json({ error: "Token de recuperação não encontrado. Tente novamente." });
    }

    if(!token.used == false) {
      return res.status(400).json({ error: "Este token de recuperação já foi utilizado! Tente novamente." });
    }

    const { newPassword } = req.body;

    const updatedUser = await db.user.update({
      where: {
        id: token.userId!
      },
      data: {
        password: await generatePasswordHash(newPassword)
      }
    });

    const invalidToken = await db.recoverToken.update({
      where: {
        id: token.id
      },
      data: {
        used: true
      }
    });

    return res.status(200).json({ updatedUser });
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
