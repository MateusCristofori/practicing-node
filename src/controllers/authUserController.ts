import { Response } from "express";
import { db } from "../database/prisma";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { generatePasswordHash } from "../helpers/generatePasswordHash/generatePasswordHash";
import PasswordRecoverToken from "../helpers/passwordRecover/PasswordRecoverToken";
import { RequestWithToken } from "../interfaces/RequestWithToken";
import Email from "../mail/Email";

export default class AuthUserController {
  async dashboard(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const user_id = req.token.user.id;

    const userNews = await db.news.findMany({
      where: {
        userId: user_id,
      },
      include: {
        post: true,
      },
    });

    if (!userNews) {
      return res
        .status(404)
        .json({ error: "Você ainda não possui nenhuma notícia cadastrada." });
    }

    return res.status(200).json({ userNews });
  }

  async updateUser(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const user_id = req.token.user.id;

    const { content }: CreateUserDTO = req.body;

    const updatedUser = await db.user.update({
      where: {
        id: user_id,
      },
      data: {
        name: content.name,
        email: content.email,
        password: content.password,
      },
    });

    return res.status(204).json({ updatedUser });
  }

  async deleteUserById(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const user_id = req.token.user.id;

    const deletedUser = await db.user.delete({
      where: {
        id: user_id,
      },
    });

    return res.status(200).json({ deletedUser });
  }

  // Resolver bug de invalidação de token. Aparentemente o método está capturando apenas metade do token usado.
  async userLogout(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const bearerToken = req.headers.authorization;
    const token = bearerToken && bearerToken.split(" ")[1];

    if (!token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const invalidToken = await db.blackListToken.create({
      data: {
        token,
        userId: req.token.user.id,
      },
    });

    res
      .status(200)
      .json({ msg: "Deslogado. Necessário logar novamente!", invalidToken });
  }
}
