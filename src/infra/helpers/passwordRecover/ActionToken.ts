import { randomUUID } from "crypto";
import { db } from "../../database/prisma";

class ActionToken {
  async findActionToken(token: string) {
    const actionToken = await db.recoverToken.findFirst({
      where: {
        token,
      },
      select: {
        id: true,
        used: true,
        userId: true,
      },
    });

    return {
      actionToken,
    };
  }

  async createActionToken(userId: string) {
    const actionToken = await db.recoverToken.create({
      data: {
        userId,
        token: randomUUID(),
        used: false,
      },
      select: {
        token: true,
      },
    });
    const token: string = actionToken.token;

    return {
      token,
    };
  }

  async invalidateActionToken(id: string) {
    const invalidateActionToken = await db.recoverToken.update({
      where: {
        id,
      },
      data: {
        used: true,
      },
    });

    return true;
  }
}

export default new ActionToken();
