import { randomUUID } from "crypto"
import { db } from "../../database/prisma"

export const createPasswordRecoverToken = async (userId: string) => {
  return await db.recoverToken.create({
    data: {
      userId: userId,
      token: randomUUID(),
      used: false
    }
  });
}