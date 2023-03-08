import { Response } from "express";
import { IBlackListTokenRepository } from "../database/repositories/interfaces/IBlackListTokenRepository";
import { INewsRepository } from "../database/repositories/interfaces/INewsRepository";
import { IUserRepository } from "../database/repositories/interfaces/IUserRepository";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import ActionToken from "../helpers/passwordRecover/ActionToken";
import { RequestWithToken } from "../interfaces/RequestWithToken";
import Email from "../mail/Email";

export default class AuthUserController {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly newsRepository: INewsRepository,
    private readonly blackListRepository: IBlackListTokenRepository
  ) {}

  async dashboard(req: RequestWithToken, res: Response) {
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

  async updateUser(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const user_id = req.token.user.id;
    const { user }: CreateUserDTO = req.body;
    const updatedUser = await this.userRepository.update(
      user_id,
      user.name,
      user.email,
      user.password
    );
    return res.status(204).json({ updatedUser });
  }

  async deleteUserByEmail(req: RequestWithToken, res: Response) {
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

    await this.userRepository.deleteById(req.token.user.id);
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

    const invalidToken = await this.blackListRepository.create(
      token,
      req.token.user.id
    );

    res.status(200).json({ msg: "Deslogado.", invalidToken });
  }
}
