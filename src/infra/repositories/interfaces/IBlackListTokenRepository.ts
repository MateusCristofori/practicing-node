import { BlackListToken } from "@prisma/client";

export interface IBlackListTokenRepository {
  create(token: string, userId: string): Promise<BlackListToken>;
}
