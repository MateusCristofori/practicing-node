import { randomUUID } from "crypto";
import { Response } from "express";
import { db } from "../../database/prisma";
import { RequestWithToken } from "../../interfaces/RequestWithToken";

export const createPasswordRecoverToken = async (req: RequestWithToken, res: Response) => {
  const { email } = req.body;

  const user = await db.user.findFirst({
    where: { email }
  });

  if(!user) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }

  const recoverToken = await db.recoverToken.create({
    data: {
      userId: user.id,
      token: randomUUID(),
      used: false
    }
  });

  const token = recoverToken.token;
  return res.json({ token });
}
