import { BlackListToken } from "@prisma/client";
import { db } from "../prisma";
import { IBlackListTokenRepository } from "./interfaces/IBlackListTokenRepository";

export class BlackListTokenRepository implements IBlackListTokenRepository {
  async create(token: string, userId: string): Promise<BlackListToken> {
    return await db.blackListToken.create({
      data: {
        token,
        userId,
      },
    });
  }
}
