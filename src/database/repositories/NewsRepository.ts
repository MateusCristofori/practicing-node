import { News, Post } from "@prisma/client";
import { db } from "../prisma";
import { INewsRepository } from "./interfaces/INewsRepository";

export class NewsRepository implements INewsRepository {
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

  // Método de teste. Objetivo: Liberdade de poder usar um método com parâmetro de filtragem, ou não, sem precisar usar sobrecarga de método.
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
