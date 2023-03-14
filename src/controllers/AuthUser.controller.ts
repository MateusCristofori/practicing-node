import { BlackListToken, News, User } from "@prisma/client";
import { Request, Response } from "express";
import { IBlackListTokenRepository } from "../infra/repositories/interfaces/IBlackListTokenRepository";
import { INewsRepository } from "../infra/repositories/interfaces/INewsRepository";
import { IUserRepository } from "../infra/repositories/interfaces/IUserRepository";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import ActionToken from "../helpers/passwordRecover/ActionToken";
import Email from "../mail/Email";

export default class AuthUserController {
  constructor(
    private readonly userRepository: IUserRepository<User>,
    private readonly newsRepository: INewsRepository<News>,
    private readonly blackListRepository: IBlackListTokenRepository<BlackListToken>
  ) {}

  async dashboard(req: Request, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const user_id = req.token.user.id;
    const userNews = await this.newsRepository.findAll(user_id);

    if (!userNews) {
      return res
        .status(404)
        .json({ error: "Você ainda não possui nenhuma notícia cadastrada." });
    }

    return res.status(200).json({ userNews });
  }

  async updateUser(req: Request, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const user_id = req.token.user.id;
    const { user }: CreateUserDTO = req.body;
    const updatedUser = await this.userRepository.update(user_id, {
      name: user.name,
      email: user.email,
      password: user.password,
    });
    return res.status(204).json({ updatedUser });
  }

  async deleteUserByEmail(req: Request, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const { email } = req.body;
    const user = await this.userRepository.findByEmail(email);

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

  async deletedUser(req: Request, res: Response) {
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

    await this.userRepository.deleteById(req.token.user.id);
    await ActionToken.invalidateActionToken(token);

    return res.status(200).json({ msg: "Usuário deletado." });
  }

  // Resolver bug de invalidação de token. Aparentemente o método está capturando apenas metade do token usado.
  async userLogout(req: Request, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const bearerToken = req.headers.authorization;
    const token = bearerToken && bearerToken.split(" ")[1];

    if (!token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const invalidToken = await this.blackListRepository.create(
      token,
      req.token.user.id
    );

    res.status(200).json({ msg: "Deslogado.", invalidToken });
  }
}
