import { News, Post, User } from "@prisma/client";
import { Request, Response } from "express";
import { INewsRepository } from "../database/repositories/interfaces/INewsRepository";
import { IPostRepository } from "../database/repositories/interfaces/IPostRepository";
import { IUserRepository } from "../database/repositories/interfaces/IUserRepository";
import { CreateNewsDTO } from "../dtos/CreateNewsDTO";

export default class NewsController {
  constructor(
    private readonly postRepository: IPostRepository<Post>,
    private readonly userRepository: IUserRepository<User>,
    private readonly newsRepository: INewsRepository<News>
  ) {}

  async listNews(req: Request, res: Response) {
    if (!req.token) {
      return res
        .status(403)
        .json({ error: "Token de autorização autorização inválido!" });
    }

    const news = await this.newsRepository.findAll();

    if (news.length == 0) {
      return res
        .status(400)
        .json({ error: "Ainda não existem notícias cadastradas!" });
    }
    res.status(200).json({ news });
  }

  async retrieveNews(req: Request, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido. " });
    }

    const { id } = req.params;
    const news = await this.newsRepository.findById(id);

    if (!news) {
      return res.status(404).json({ error: "Notícia não encontrada." });
    }

    return res.status(200).json({ news });
  }

  async createNews(req: Request, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }
    const author_id = req.token.user.id;
    const { content }: CreateNewsDTO = req.body;
    const newPost = await this.postRepository.create(author_id, content);
    const newNews = await this.newsRepository.create(newPost.id);
    return res.status(200).send({ newNews });
  }

  async updateNews(req: Request, res: Response) {
    if (!req.token) {
      return res
        .status(403)
        .json({ error: "Token de autorização invádlido. " });
    }

    const author_id = req.token.user.id;
    const author = await this.userRepository.findById(author_id);

    if (!author) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const news_id = req.params.id;
    const news = await this.newsRepository.findById(news_id);

    if (!news) {
      return res.status(404).json({ error: "Notícia não encontrada." });
    }

    if (news.post.author_id !== author.id) {
      return res.status(403).json({
        error: "Apenas o usuário que criou a notícia pode alterá-la.",
      });
    }

    const { content } = req.body;
    const newPost = await this.postRepository.update(news.postId, content);
    return res.status(204).json({ newPost });
  }

  async deleteNews(req: Request, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido. " });
    }

    const news_id = req.params.id;
    const author_id = req.token.user.id;
    const news = await this.newsRepository.findById(news_id);

    if (!news) {
      return res.status(404).json({ error: "Notícia não encontrada." });
    }

    if (news.post.author_id != author_id) {
      return res
        .status(403)
        .json({ error: "Apenas o criador da notícia pode alterá-la " });
    }

    const deletedNews = await this.postRepository.deleteById(news_id);
    return res.status(204).json({ deletedNews });
  }
}
