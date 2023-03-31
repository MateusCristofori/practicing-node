import { BlackListToken } from "@prisma/client";
import { IBlackListTokenRepository } from "./interfaces/IBlackListTokenRepository";
import { db } from "../../database/prisma";

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
