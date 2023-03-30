import { Response } from "express";
import { db } from "../database/prisma";
import { UpdateUserDTO } from "../dtos/UpdateUserDTO";
import ActionToken from "../helpers/passwordRecover/ActionToken";
import Email from "../mail/Email";
import { RequestWithToken } from "../infra/token/RequestWithToken";

export default class AuthUserController {
  async dashboard(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Invalid Token." });
    }
    const userNews = await db.news.findFirst({
      where: {
        id: req.token.user.id,
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
      return res.status(403).json({ error: "Invalid Token." });
    }
    const { user }: UpdateUserDTO = req.body;
    const updatedUser = await db.user.update({
      where: {
        id: req.token.user.id,
      },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
    return res.status(204).json({ updatedUser });
  }

  async deleteUserByEmail(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Invalid Token." });
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
      return res.status(403).json({ error: "Invalid Token." });
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

  async userLogout(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Invalid Token." });
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
