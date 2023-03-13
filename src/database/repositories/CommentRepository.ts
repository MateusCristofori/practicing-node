import { Comment, Post } from "@prisma/client";
import { db } from "../prisma";
import { ICommentRepository } from "./interfaces/ICommentRepository";

export default class CommentRepository implements ICommentRepository<Comment> {
  async findAll(): Promise<(Comment & { post: Post })[]> {
    return await db.comment.findMany({
      include: {
        post: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  async create(
    postId: string,
    userId: string
  ): Promise<(Comment & { post: Post }) | null> {
    return await db.comment.create({
      data: {
        postId,
        userId,
      },
      include: {
        post: true,
      },
    });
  }

  async findById(id: string): Promise<(Comment & { post: Post }) | null> {
    return await db.comment.findFirst({
      where: { id },
      include: {
        post: true,
      },
    });
  }

  async delete(id: string): Promise<Comment | null> {
    return await db.comment.delete({
      where: { id },
    });
  }
}
