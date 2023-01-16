import { Response } from "express";
import { db } from "../database/prisma";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { IRequestWithToken } from "../interfaces/IRequestWithToken";

export default class AuthUserController {
  async dashboard(req: IRequestWithToken, res: Response) {
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

  async updateUser(req: IRequestWithToken, res: Response) {
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

  async deleteUserById(req: IRequestWithToken, res: Response) {
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
  
  async userLogout(req: IRequestWithToken, res: Response) {
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

    res.status(200).json({ msg: "Deslogado. Faça o processo de login novamente!" });
  }
}