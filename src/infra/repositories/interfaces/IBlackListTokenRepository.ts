import { BlackListToken } from "@prisma/client";

export interface IBlackListTokenRepository<T> {
  create(token: string, userId: string): Promise<BlackListToken>;
}
