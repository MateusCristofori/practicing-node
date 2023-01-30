import { randomUUID } from "crypto";
import { Response } from "express";
import { db } from "../database/prisma";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { generatePasswordHash } from "../helpers/generatePasswordHash/generatePasswordHash";
import PasswordRecoverToken from "../helpers/passwordRecover/PasswordRecoverToken";
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
    
    if(!email) {
      return res.status(400).json({ error: "É necessário que o usuário passe o e-mail para a recuperação de senha!" });
    }

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

    // abstração de criação de token de recuperação.
    const passwordToken = await PasswordRecoverToken.createPasswordRecoverToken(user.id);

    if(!passwordToken) {
      return res.status(400).json({ error: "Ocorreu um erro durante a criação do token de recuperação de senha." });
    }

    return res.json({ passwordToken });
  }

  async changePassword(req: RequestWithToken, res: Response) {
    if(!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido."});
    }

    const { newPassword } = req.body;

    if(!newPassword) {
      return res.status(400).json({ error: "A nova senha não pode ser vazia!" });
    }

    const token = req.params.token;

    // Abstração de query de procura de token.
    const passwordToken = await PasswordRecoverToken.findPasswordToken(token);

    if(!passwordToken.passwordToken) {
      return res.status(400).json({ error: "Token de recuperação de senha não encontrado." });
    }

    if(passwordToken.passwordToken.used) {
      return res.status(400).json({ error: "Token de recuperação já usado." });
    }

    const user = await db.user.update({
      where: {
        id: req.token.user.id
      },
      data: {
        password: await generatePasswordHash(newPassword),
      }
    });

    // Abstração de invalidação de token usado.
    PasswordRecoverToken.invalidateToken(passwordToken.passwordToken.id);

    return res.status(200).json({ user });
  }

  // Resolver bug de invalidação de token. Aparentemente o método está capturando apenas metade do token usado.
  async userLogout(req: RequestWithToken, res: Response) {
    if(!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const bearerToken = req.headers.authorization;
    const token = bearerToken && bearerToken.split(" ")[1];

    if(!token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const invalidToken = await db.blackListToken.create({
      data: {
        token
      }
    });

    res.status(200).json({ msg: "Deslogado. Necessário logar novamente!" , invalidToken });
  }
}