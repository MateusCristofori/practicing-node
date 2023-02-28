import { randomUUID } from "crypto";
import { db } from "../../database/prisma";

// Classe para abstração de funções.
class PasswordRecoverToken {
  async findPasswordToken(token: string) {
    const passwordToken = await db.recoverToken.findFirst({
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
      passwordToken,
    };
  }

  async createPasswordRecoverToken(userId: string) {
    const passwordRecoverToken = await db.recoverToken.create({
      data: {
        userId,
        token: randomUUID(),
        used: false,
      },
      select: {
        token: true,
      },
    });
    const token: string = passwordRecoverToken.token;

    return {
      token,
    };
  }

  async invalidateToken(id: string) {
    const invalidatePasswordToken = await db.recoverToken.update({
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

export default new PasswordRecoverToken();
