import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { IUserRepository } from "../database/repositories/interfaces/IUserRepository";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import UserLoginDTO from "../dtos/UserLoginDTO";
import CheckValidateToken from "../helpers/checkValidateToken/CheckValidateToken";
import { generateAccessToken } from "../helpers/generateAccessToken/generateAcessToken";
import ActionToken from "../helpers/passwordRecover/ActionToken";
import Email from "../mail/Email";

export default class UserController {
  constructor(private readonly userRepository: IUserRepository) {}

  async registerNewUserHandler(req: Request, res: Response) {
    const { user }: CreateUserDTO = req.body;

    if (!user) {
      return res
        .status(404)
        .json({ error: "Precisa-se passar todas as credenciais." });
    }

    if (!user.email.includes("@")) {
      return res
        .status(400)
        .json({ error: "Deve-se passar o e-mail e senha!" });
    }

    const newUser = await this.userRepository.create(
      user.name,
      user.email,
      user.password
    );
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

    const user = await this.userRepository.findByEmail(content.email);

    if (!user) {
      return res.status(400).json({ error: "E-mail incorreto!" });
    }

    const passwordMatch = await bcrypt.compare(content.password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Senha incorreta!" });
    }

    const token = await generateAccessToken(user.id, user.name, user.email);
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

  async passwordRecover(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error:
          "É necessário que o usuário passe o e-mail para a recuperação de senha!",
      });
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const passwordObject = await ActionToken.createActionToken(user.id);
    const passwordTokenURL = `${process.env.URL_CHANGE_PASSWORD}/${passwordObject.token}`;

    new Email().sendEmail(
      passwordTokenURL,
      "Recuperação de senha",
      "Clique para recuperar sua senha."
    );

    return res.status(200).send();
  }

  async changePassword(req: Request, res: Response) {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res
        .status(400)
        .json({ error: "A nova senha não pode ser vazia!" });
    }

    const token = req.params.token;
    const passwordToken = await ActionToken.findActionToken(token);

    if (!passwordToken.actionToken) {
      return res
        .status(400)
        .json({ error: "Token de recuperação de senha não encontrado." });
    }

    if (passwordToken.actionToken.used) {
      return res.status(400).json({ error: "Token de recuperação já usado." });
    }

    // const user = await db.user.update({
    //   where: {
    //     id: passwordToken.actionToken.userId,
    //   },
    //   data: {
    //     password: await generatePasswordHash(newPassword),
    //   },
    // });
    // const user = await this.userRepository.update(passwordToken.actionToken.userId, )
    ActionToken.invalidateActionToken(passwordToken.actionToken.id);

    return res.status(200).json({ user });
  }
}
