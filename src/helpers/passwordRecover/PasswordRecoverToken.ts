import { randomUUID } from "crypto";
import { db } from "../../database/prisma";

class PasswordRecoverToken {
  async findPasswordToken(token: string) {
    const passwordToken = await db.recoverToken.findFirst({
      where: {
        token
      },
      select: {
        id: true,
        used: true
      }
    });

    return {
      passwordToken
    }
  }

  async createPasswordRecoverToken(userId: string) {
    const passwordRecoverToken = await db.recoverToken.create({
      data: {
        userId,
        token: randomUUID(),
        used: false
      },
      select: {
        token: true
      }
    });
    const token = passwordRecoverToken.token;
    
    return {
      token
    }
  }

  async invalidateToken(id: string) {
    const invalidatePasswordToken = await db.recoverToken.update({
      where: {
        id
      },
      data: {
        used: true
      }
    });

    return true;
  }
}

export default new PasswordRecoverToken();