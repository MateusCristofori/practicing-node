import { Response } from "express"
import { CreateNewsDTO } from "../dtos/CreateNewsDTO"
import { IRequestWithToken } from "../interfaces/IRequestWithToken"
import News from "../models/News"
import { CreateNewsValidation } from "../validations/Validations"

export class ControllerUserAuthenticated {
  static dashboardHandler = async (request: IRequestWithToken, response: Response) => {
    return response.status(200).json({msg: "Seja bem-vindo ao dashboard!", token: request.token})
  }

  static userNews = async (request: IRequestWithToken, response: Response) => {
    // Em desenvolvimento...
    const userId = request.token!.user.id;

    const news = News.find({user_id: userId});

    if(!news) {
      response.status(200).json({msg: "Você ainda não possui nenhuma notícia publicada!"});
      return;
    }

    response.status(200).json(news);
  }

  static createNews = async (request: IRequestWithToken, response: Response) => {
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
}
