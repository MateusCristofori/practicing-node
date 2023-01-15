import { Response } from "express";
import { CreateNewsDTO } from "../dtos/CreateNewsDTO";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { generatePasswordHash } from "../helpers/generatePasswordHash/generatePasswordHash";
import { IRequestWithToken } from "../interfaces/IRequestWithToken";
import IBlackListToken from "../models/IBlackListToken";
import News from "../models/News";
import User from "../models/User";
import { CreateNewsValidation, Validation } from "../validations/Validations";

export class AuthUserController {
  static dashboardHandler = async (req: IRequestWithToken, res: Response) => {
    return res.status(200).json({ msg: "Seja bem-vindo ao dashboard!", token: req.token })
  }

  static createNewsHandler = async (req: IRequestWithToken, res: Response) => {
    const { title, subtitle, category, subject }: CreateNewsDTO = req.body;

    CreateNewsValidation.checkTitle(title);
    CreateNewsValidation.checkSubTitle(subtitle);
    CreateNewsValidation.checkCategory(category);
    CreateNewsValidation.checkSubject(subject);

    const news = new News({
      title,
      subject,
      category,
      subtitle,
      created_at: Date.now(),
      user_id: req.token!.user.id
    })

    await news.save();
    return res.status(200).send({ news })
  }

  static userLogoutHandler = async (req: IRequestWithToken, res: Response) => {
    const invalidToken = req.headers.authorization;
    const token = invalidToken && invalidToken.split(" ")[1];
  
    const insertInvalidToken = new IBlackListToken({
      token: token
    });
  
    const blackListToken = insertInvalidToken.save();
  
    res.status(200).json({ msg: "Deslogado. Faça o processo de login novamente!" });
  }

  static updateUserHandler = async (req: IRequestWithToken, res: Response) => {
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

  static deleteUserByIdHandler = async (req: IRequestWithToken, res: Response) => {
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

  
}