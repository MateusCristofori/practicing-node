import { Response } from "express";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { generatePasswordHash } from "../helpers/generatePasswordHash/generatePasswordHash";
import { IRequestWithToken } from "../interfaces/IRequestWithToken";
import IBlackListToken from "../models/IBlackListToken";
import News from "../models/News";
import User from "../models/User";
import { Validation } from "../validations/Validations";

export default class AuthUserController {
  async dashboardHandler(req: IRequestWithToken, res: Response) {
    if(!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const user_id = req.token.user.id;

    const userNews = await News.find({
      user_id: user_id
    });

    if(!userNews) {
      return res.status(404).json({ error: "Você ainda não possui nenhuma notícia cadastrada." });
    }

    return res.status(200).json({ userNews });
  }

  async updateUserHandler(req: IRequestWithToken, res: Response) {
    const id: string = req.params.id;
    
    if(!id) {
      return res.status(400).json({ error: "O id do usuário precisa ser válido." });
    }

    const { name, email, password }: CreateUserDTO = req.body;

    Validation.checkUserEmail(email);
    Validation.checkUserName(name);
    Validation.checkUserPassword(password);

   const newPasswordHash = await generatePasswordHash(password);

    const user = {
      name,
      email,
      password: newPasswordHash
    };
  
    const updatedUser = await User.findOneAndUpdate({ _id: id }, user);
    
    if(!updatedUser) {
      return res.status(404).json({ error: "Usuário não encontrado!" });
    }
  
    res.status(200).json({ user });
  }

  async deleteUserByIdHandler(req: IRequestWithToken, res: Response) {
     if(!req.token) {
      return res.status(403).json({error: "Token de autorização inválido!"});
    }

    const id: string = req.params.id;
    
    const deletedUser = await User.findByIdAndDelete({ _id: id });

    if(!deletedUser) {
      return res.status(404).json({ error: "Usuário não encontrado!" });
    }

    res.status(200).json({msg: "Usuário deletado com sucesso."});
  }
  
  async userLogoutHandler(req: IRequestWithToken, res: Response) {
    const invalidToken = req.headers.authorization;
    const token = invalidToken && invalidToken.split(" ")[1];
  
    const insertInvalidToken = new IBlackListToken({
      token: token
    });
  
    const blackListToken = insertInvalidToken.save();
  
    res.status(200).json({ msg: "Deslogado. Faça o processo de login novamente!" });
  }
}