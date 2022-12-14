import { Response } from "express";
import { CreateNewsDTO } from "../dtos/CreateNewsDTO";
import { NotFoundError } from "../helpers/Errors/api_error";
import { IRequestWithToken } from "../interfaces/IRequestWithToken";
import IBlackListToken from "../models/IBlackListToken";
import News from "../models/News";
import User from "../models/User";
import { CreateNewsValidation, Validation } from "../validations/Validations";
import { generatePasswordHash } from "../helpers/generatePasswordHash/generatePasswordHash";
import { CreateUserDTO } from "../dtos/CreateUserDTO";

export class AuthUserService {
  static dashboard = async (request: IRequestWithToken, response: Response) => {
    return response.status(200).json({msg: "Seja bem-vindo ao dashboard!", token: request.token})
  }
  
  // Corrigir erro -> O método está retornando um array vazio de notícias quando deveria retornar um "NotFoundError()".
  static getUserNews = async (request: IRequestWithToken, response: Response) => {
    const userId = request.token!.user.id;

    const news = await News.find({ user_id: userId });
    
    if(news.length == 0) {
      throw new NotFoundError("Você ainda não possui notícias cadastradas!");
    }

    response.status(200).json({ news: news });
  }

  static createNews = async (request: IRequestWithToken, response: Response) => {
    const { title, subtitle, category, subject }: CreateNewsDTO = request.body;

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
      user_id: request.token!.user.id
    })

    await news.save();
    return response.status(200).send({news})
  }

  static updateNews = async (request: IRequestWithToken, response: Response) => {
    const news_id = request.params.id;

    if(!news_id) {
      throw new NotFoundError("O id da notícia precisa ser válido!");
    }

    const { title, subtitle, category, subject }: CreateNewsDTO = request.body;
    
    const updatedNews = {
      title,
      subtitle,
      category,
      subject,
    }

    const news = await News.findOneAndUpdate({_id: news_id}, updatedNews);
    response.status(200).json(news);
  }

  static deleteNews = async (request: IRequestWithToken, response: Response) => {
    const news_id = request.params.id;

    if(!news_id) {
      throw new NotFoundError("A notícia não existe!");
    }

    const news = await News.findOneAndDelete({_id: news_id});

    response.status(200).json({msg: "Notícia deletada com sucesso!", news: news});
  }

  static userLogOut = (request: IRequestWithToken, response: Response) => {
 
    const invalidToken = request.headers.authorization;
    const token = invalidToken && invalidToken.split(" ")[1];
  
    const insertInvalidToken = new IBlackListToken({
      token: token
    });
  
    const blackListToken = insertInvalidToken.save();
  
    response.status(200).json({msg: "Deslogado. Faça o processo de login novamente!"});
  }

  static updateUserHandler = async(request: IRequestWithToken, response: Response) => {
    const id: string = request.params.id;
    
    if(!id) {
      throw new NotFoundError("Usuário não encontrado!");
    }

    const { name, email, password }: CreateUserDTO = request.body;

    Validation.checkUserEmail(email);
    Validation.checkUserName(name);
    Validation.checkUserPassword(password);

   const newPasswordHash = await generatePasswordHash(password);

    const user = {
      name,
      email,
      password: newPasswordHash
    };
  
    const updatedUser = await User.findOneAndUpdate({_id: id}, user);
    
    if(!updatedUser) {
      throw new NotFoundError("Usuário não encontrado!");
    }
  
    response.status(200).json(user);
  }

  static deleteUserById = async(request: IRequestWithToken, response: Response) => {

    const id: string = request.params.id;
    
    const deletedUser = await User.findByIdAndDelete({_id: id});

    if(!deletedUser) {
      throw new NotFoundError("Usuário não encontrado!");
    }

    response.status(200).json({msg: "Usuário deletado com sucesso."});
  }
}
