import { News, Post } from "@prisma/client";
import { db } from "../../database/prisma";
import { INewsRepository } from "./interfaces/INewsRepository";

export default class NewsRepository implements INewsRepository {
  async create(postId: string): Promise<News> {
    return await db.news.create({
      data: {
        postId,
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

  async findAll(id?: string): Promise<(News & { post: Post })[]> {
    return await db.news.findMany({
      where: {
        id,
      },
      include: {
        post: true,
      },
    });
  }
}
