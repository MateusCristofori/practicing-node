import { Response } from "express";
import { db } from "../infra/database/prisma";
import { CreateNewsDTO } from "../dtos/CreateNewsDTO";
import { RequestWithToken } from "../infra/token/RequestWithToken";

export default class NewsController {
  async listNews(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res
        .status(403)
        .json({ error: "Token de autorização autorização inválido!" });
    }
    const news = await db.news.findMany();
    if (news.length == 0) {
      return res
        .status(400)
        .json({ error: "Ainda não existem notícias cadastradas!" });
    }
    res.status(200).json({ news });
  }

  async retrieveNews(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido. " });
    }
    const { id } = req.params;
    const news = await db.news.findFirst({
      where: {
        id,
      },
    });
    if (!news) {
      return res.status(404).json({ error: "Notícia não encontrada." });
    }
    return res.status(200).json({ news });
  }

  async createNews(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }
    const author_id = req.token.user.id;
    const { content }: CreateNewsDTO = req.body;
    const newPost = await db.post.create({
      data: {
        author_id,
        content,
      },
    });
    const newNews = await db.news.create({
      data: {
        postId: newPost.id,
      },
    });
    return res.status(200).send({ newNews });
  }

  async updateNews(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res
        .status(403)
        .json({ error: "Token de autorização invádlido. " });
    }
    const author_id = req.token.user.id;
    const author = await db.user.findFirst({
      where: {
        id: author_id,
      },
    });
    if (!author) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    const news_id = req.params.id;
    const news = await db.news.findFirst({
      where: {
        id: news_id,
      },
      include: {
        post: true,
      },
    });
    if (!news) {
      return res.status(404).json({ error: "Notícia não encontrada." });
    }
    if (news.post.author_id !== author.id) {
      return res.status(403).json({
        error: "Apenas o usuário que criou a notícia pode alterá-la.",
      });
    }
    const { content } = req.body;
    const newPost = await db.post.update({
      where: {
        id: news.postId,
      },
      data: {
        content,
      },
    });
    return res.status(204).json({ newPost });
  }

  async deleteNews(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido. " });
    }
    const news_id = req.params.id;
    const author_id = req.token.user.id;
    const news = await db.news.findFirst({
      where: {
        id: news_id,
      },
      include: {
        post: true,
      },
    });
    if (!news) {
      return res.status(404).json({ error: "Notícia não encontrada." });
    }
    if (news.post.author_id != author_id) {
      return res
        .status(403)
        .json({ error: "Apenas o criador da notícia pode alterá-la " });
    }
    const deletedNews = await db.post.delete({
      where: {
        id: news_id,
      },
    });
    return res.status(204).json({ deletedNews });
  }
}
