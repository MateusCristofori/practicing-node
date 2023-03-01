import { Response } from "express";
import { db } from "../database/prisma";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import ActionToken from "../helpers/passwordRecover/ActionToken";
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

  async deleteUserByEmail(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const { email } = req.body;

    const user = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const deleteUserToken = await ActionToken.createActionToken(user.id);
    const deleteUserURL = `${process.env.URL_DELETE_USER}/${deleteUserToken.token}`;

    new Email().sendEmail(
      deleteUserURL,
      "Deleção de usuário",
      "Clique para deletar seu perfil."
    );

    return res.status(200).send();
  }

  async deletedUser(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const token = req.params.token;

    const findToken = await ActionToken.findActionToken(token);

    if (!findToken) {
      return res
        .status(404)
        .json({ error: "Token de recuperação não encontrado." });
    }

    if (findToken.actionToken?.used) {
      return res.status(400).json({ error: "Token já utilizado." });
    }

    await db.user.delete({
      where: {
        id: req.token.user.id,
      },
    });

    await ActionToken.invalidateActionToken(token);

    return res.status(200).json({ msg: "Usuário deletado." });
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

    res.status(200).json({ msg: "Deslogado.", invalidToken });
  }
}
