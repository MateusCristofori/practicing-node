import { Request, Response } from "express";
import { Comment, Post, User } from "@prisma/client";
import { ICommentRepository } from "../infra/repositories/interfaces/ICommentRepository";
import { IPostRepository } from "../infra/repositories/interfaces/IPostRepository";
import { IUserRepository } from "../infra/repositories/interfaces/IUserRepository";

export default class CommentController {
  constructor(
    private readonly commentRepository: ICommentRepository<Comment>,
    private readonly postRepository: IPostRepository<Post>,
    private readonly userRepository: IUserRepository<User>
  ) {}

  async listComments(req: Request, res: Response) {
    const comments = await this.commentRepository.findAll();

    if (comments.length == 0) {
      return res
        .status(404)
        .json({ error: "Nenhum comentário foi encontrado." });
    }

    return res.status(200).json(comments);
  }

  async create(req: Request, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const { content } = req.body;

    if (!content) {
      return res.status(404).json({ error: "Erro ao criar um comentário." });
    }

    const post = await this.postRepository.create(content, req.token.user.id);
    const comment = await this.commentRepository.create(
      post.id,
      req.token.user.id
    );

    return res.status(201).json(comment);
  }

  async update(req: Request, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const author_id = req.token.user.id;
    const author = await this.userRepository.findById(author_id);

    if (!author) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const { id } = req.params;
    const comment = await this.commentRepository.findById(id);

    if (!comment) {
      return res.status(404).json({ error: "Comentário não encontrado." });
    }

    if (comment.post.author_id !== author.id) {
      return res.status(403).json({
        error: "Apenas o usuário que criou o comentário poderá atualizá-lo.",
      });
    }

    const { content } = req.body;

    const updatedComment = await this.postRepository.update(
      comment.id,
      content
    );

    return res.status(204).json({ updatedComment });
  }

  async delete(req: Request, res: Response) {
    if (!req.token) {
      return res.status(403).json({ error: "Token de autorização inválido." });
    }

    const author_id = req.token.user.id;
    const { id } = req.params;

    const author = await this.userRepository.findById(author_id);

    if (!author) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const comment = await this.commentRepository.findById(id);

    if (!comment) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }

    if (comment.post.author_id !== author.id) {
      return res.status(403).json({
        error: "Apenas o usuário que criou o comentário pode deletá-lo.",
      });
    }

    const deletedComment = await this.commentRepository.delete(id);
    return res.status(200).json(deletedComment);
  }
}
