import { Response } from "express";
import { db } from "../database/prisma";
import { RequestWithToken } from "../infra/token/RequestWithToken";

export default class CommentController {
  async listComments(req: RequestWithToken, res: Response) {
    const comments = await db.comment.findMany();
    if (comments.length == 0) {
      return res
        .status(404)
        .json({ error: "Nenhum comentário foi encontrado." });
    }
    return res.status(200).json(comments);
  }

  async create(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }
    const { content } = req.body;
    if (!content) {
      return res.status(404).json({ error: "Erro ao criar um comentário." });
    }
    const post = await db.post.create({
      data: {
        author_id: req.token.user.id,
        content,
      },
    });
    const comment = await db.comment.create({
      data: {
        postId: post.id,
        userId: req.token.user.id,
      },
    });
    return res.status(201).json(comment);
  }

  async update(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
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
    const { id } = req.params;
    const comment = await db.comment.findFirst({
      where: {
        id,
      },
      include: {
        post: true,
      },
    });
    if (!comment) {
      return res.status(404).json({ error: "Comentário não encontrado." });
    }
    if (comment.post.author_id !== author.id) {
      return res.status(403).json({
        error: "Apenas o usuário que criou o comentário poderá atualizá-lo.",
      });
    }
    const { content } = req.body;
    const updatedComment = await db.post.update({
      where: {
        id: comment.id,
      },
      data: {
        content,
      },
    });
    return res.status(204).json({ updatedComment });
  }

  async delete(req: RequestWithToken, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }
    const author_id = req.token.user.id;
    const { id } = req.params;
    const author = await db.user.findFirst({
      where: {
        id: author_id,
      },
    });
    if (!author) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    const comment = await db.comment.findFirst({
      where: {
        id,
      },
      include: {
        post: true,
      },
    });
    if (!comment) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }
    if (comment.post.author_id !== author.id) {
      return res.status(403).json({
        error: "Apenas o usuário que criou o comentário pode deletá-lo.",
      });
    }
    const deletedComment = await db.comment.delete({
      where: {
        id,
      },
    });
    return res.status(200).json(deletedComment);
  }
}
