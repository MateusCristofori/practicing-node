import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../../database/prisma";
import { JwtPayloadUserInfo } from "../../infra/token/JwtPayloadUserInfo";
import { RequestWithToken } from "../../infra/repositories/interfaces/RequestWithToken";

export const tokenValidation = async (
  req: RequestWithToken,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization;
  const token = authToken && authToken.split(" ")[1];

  const secret = process.env.SECRET;

  const invalidToken = await db.blackListToken.findFirst({
    where: {
      token,
    },
  });

  if (invalidToken) {
    return res.status(403).json({ error: "Token inválido!" });
  }

  if (!token || !secret) {
    return res.status(403).json({ error: "Acesso restrito!" });
  }

  req.token = jwt.verify(token, secret) as JwtPayloadUserInfo;

  next();
};
