import { BlackListToken } from "@prisma/client";
import { db } from "../../database/prisma";
import { IBlackListTokenRepository } from "./interfaces/IBlackListTokenRepository";

export class BlackListTokenRepository
  implements IBlackListTokenRepository<BlackListToken>
{
  async create(token: string, userId: string): Promise<BlackListToken> {
    return await db.blackListToken.create({
      data: {
        token,
        userId,
      },
    });
  }
}
