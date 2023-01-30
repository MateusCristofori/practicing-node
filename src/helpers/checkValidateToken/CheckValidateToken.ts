import { db } from "../../database/prisma";

class CheckValidationToken {
  async isTokenValid(token: string) {
    const invalidToken = await db.blackListToken.findFirst({
      where: {
        token
      },
    });

    if(invalidToken?.token) {
      return { error: "Token inválido." }
    }

    return {
      invalidToken
    }
  }
}

export default new CheckValidationToken();
