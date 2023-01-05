import { Response } from "express";
import { CreateNewsDTO } from "../../dtos/CreateNewsDTO";
import { NotFoundError } from "../../helpers/Errors/api_error";
import { IRequestWithToken } from "../../interfaces/IRequestWithToken";
import IBlackListToken from "../../models/IBlackListToken";
import News from "../../models/News";
import User from "../../models/User";
import { CreateNewsValidation, Validation } from "../../validations/Validations";
import { generatePasswordHash } from "../../helpers/generatePasswordHash/generatePasswordHash";
import { CreateUserDTO } from "../../dtos/createUserDTO";

export class AuthUserService {
  static dashboardHandler = async (request: IRequestWithToken, response: Response) => {
    return response.status(200).json({msg: "Seja bem-vindo ao dashboard!", token: request.token})
  }
  
  // Em desenvolvimento...
  // static getUserNewsHandler = async (request: IRequestWithToken, response: Response) => {
  //   const userId = request.token!.user.id;

  //   const news = News.find({user_id: userId});

  //   if(!news) {
  //     response.status(200).json({msg: "Você ainda não possui nenhuma notícia publicada!"});
  //     return;
  //   }

  //   response.status(200).json(news);
  // }

  static createNewsHandler = async (request: IRequestWithToken, response: Response) => {
    const { title, subtitle, category, subject }: CreateNewsDTO = request.body;

    CreateNewsValidation.checkTitle(title);
    CreateNewsValidation.checkSubTitle(subtitle);
    CreateNewsValidation.checkCategory(category);
    CreateNewsValidation.checkSubject(subject);

    const news = News.create({
      title,
      subject,
      category,
      subtitle
    })

    return response.status(200).send({news})
  }

  static userLogOutHandler = (request: IRequestWithToken, response: Response) => {
 
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

  static deleteUserByIdhandler = async(request: IRequestWithToken, response: Response) => {

    const id: string = request.params.id;
    
    const deletedUser = await User.findByIdAndDelete({_id: id});

    if(!deletedUser) {
      throw new NotFoundError("Usuário não encontrado!");
    }

    response.status(200).json({msg: "Usuário deletado com sucesso."});
  }
}
