import { Comment, Post } from "@prisma/client";

export interface ICommentRepository<T> {
  findAll(): Promise<(Comment & { post: Post })[]>;
  findById(id: string): Promise<(Comment & { post: Post }) | null>;
  create(
    postId: string,
    userId: string
  ): Promise<(Comment & { post: Post }) | null>;
  delete(id: string): Promise<Comment | null>;
}
