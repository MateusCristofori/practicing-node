import { Post } from "@prisma/client";
import { db } from "../../database/prisma";
import { IPostRepository } from "./interfaces/IPostRepository";
import { injectable } from "tsyringe";

@injectable()
export class PostRepository implements IPostRepository<Post> {
  async update(id: string, content: string): Promise<Post> {
    return await db.post.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });
  }

  async deleteById(id: string): Promise<Post> {
    return await db.post.delete({
      where: {
        id,
      },
    });
  }

  async create(author_id: string, content: string): Promise<Post> {
    return await db.post.create({
      data: {
        author_id,
        content,
      },
    });
  }
}
