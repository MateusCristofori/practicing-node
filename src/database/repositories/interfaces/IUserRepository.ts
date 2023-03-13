import { User } from "@prisma/client";

export interface IUserRepository<T> {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(name: string, email: string, password: string): Promise<User>;
  update(
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
    }
  ): Promise<User | null>;
  deleteById(id: string): Promise<User | null>;
  deleteByEmail(email: string): Promise<User | null>;
}
