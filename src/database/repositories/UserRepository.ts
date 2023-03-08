import { User } from "@prisma/client";
import { db } from "../prisma";
import { IUserRepository } from "./interfaces/IUserRepository";

export default class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return db.user.findFirst({
      where: {
        email,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return await db.user.findMany({});
  }

  async findById(id: string): Promise<User | null> {
    return await db.user.findFirst({
      where: {
        id,
      },
    });
  }

  async create(name: string, email: string, password: string): Promise<User> {
    return await db.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });
  }

  async update(
    id: string,
    name?: string,
    email?: string,
    password?: string
  ): Promise<User | null> {
    return await db.user.update({
      where: {
        id,
      },
      data: {
        name: name,
        email: email,
        password: password,
      },
    });
  }

  async deleteById(id: string): Promise<User | null> {
    return await db.user.delete({
      where: {
        id: id,
      },
    });
  }

  async deleteByEmail(email: string): Promise<User | null> {
    return await db.user.delete({
      where: {
        email,
      },
    });
  }
}
