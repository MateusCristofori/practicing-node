import { Post } from "@prisma/client";
import { db } from "../prisma";
import { IPostRepository } from "./interfaces/IPostRepository";

export class PostRepository implements IPostRepository {
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
