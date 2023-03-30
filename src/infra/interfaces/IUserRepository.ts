import { User } from "@prisma/client";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create({ name, email, password }: User): Promise<User>;
  update(
    id: string,
    name?: string,
    email?: string,
    password?: string
  ): Promise<User | null>;
  deleteById(id: string): Promise<User | null>;
  deleteByEmail(email: string): Promise<User | null>;
}
