import { News, Post } from "@prisma/client";

export interface INewsRepository {
  findAll(userId?: string): Promise<(News & { post: Post })[]>;
  findById(id: string): Promise<(News & { post: Post }) | null>;
  create(postId: string): Promise<News & { post: Post }>;
  deleteById(id: string): Promise<News | null>;
}
