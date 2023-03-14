import { News, Post } from "@prisma/client";
import { db } from "../../database/prisma";
import { INewsRepository } from "./interfaces/INewsRepository";

export class NewsRepository implements INewsRepository<News> {
  async findAll(): Promise<(News & { post: Post })[]> {
    return await db.news.findMany({
      include: {
        post: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  async findById(id: string): Promise<(News & { post: Post }) | null> {
    return await db.news.findFirst({
      where: {
        id,
      },
      include: {
        post: true,
      },
    });
  }

  async deleteById(id: string): Promise<News | null> {
    return await db.news.delete({
      where: {
        id,
      },
    });
  }

  async create(postId: string): Promise<News & { post: Post }> {
    return await db.news.create({
      data: {
        postId,
      },
      include: {
        post: true,
      },
    });
  }
}
