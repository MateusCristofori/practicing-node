import { Response } from "express";
import { CreateNewsDTO } from "../dtos/CreateNewsDTO";
import { IRequestWithToken } from "../interfaces/IRequestWithToken";
import News from "../models/News";
import { CreateNewsValidation } from "../validations/Validations";

export default class NewsController {
  async getNewsHandler(req: IRequestWithToken, res: Response) {
    if(!req.token) {
      return res.status(403).json({ error: "Token de autorização autorização inválido!" });
    }

    const news = await News.find({}, "-user_id");
    
    if(news.length == 0) {
      return res.status(400).json({ error: "Você ainda existe notícias cadastradas!" });
    }

    res.status(200).json({ news });
  }

  async getNewsByIdHandler(req: IRequestWithToken, res: Response) {
    if(!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido. "});
    }

    const news_id = req.token.user.id;

    const news = await News.findById({ _id: news_id });

    if(!news) {
      return res.status(404).json({ error: "Notícia não encontrada." });
    }

    return res.status(200).json({ news });
  }

  async createNewsHandler(req: IRequestWithToken, res: Response) {
    if(!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

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
      user_id: req.token.user.id
    });

    await news.save();
    return res.status(200).send({ news });
  }

  async updateNews(req: IRequestWithToken, res: Response) {
    if(!req.token) {
      return res.status(403).json({ error: "Token de autorização invádlido. "});
    }

    const news_id = req.params.id;

    const findNews = await News.findById({ _id: news_id });

    if(!findNews) {
      return res.status(404).json({ error: "Notícia não encontrada." });
    }

    const { title, subtitle, category, subject }: CreateNewsDTO = req.body;
    
    const updatedNews = {
      title,
      subtitle,
      category,
      subject,
    }

    const news = await News.findOneAndUpdate({ _id: news_id }, updatedNews);

    res.status(200).json({ news });
  }

  async deleteNewsHandler(req: IRequestWithToken, res: Response) {
    if(!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido!" });
    }

    const news_id = req.params.id;

    const findNews = await News.findById({ _id: news_id });

    if(!findNews) {
      return res.status(404).json({ error: "Notícia não encontrada." });
    }

    const news = await News.findOneAndDelete({ _id: news_id });

    res.status(200).json({ msg: "Notícia deletada com sucesso!", news });
  }
}