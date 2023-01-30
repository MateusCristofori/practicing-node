import { db } from "../../database/prisma";

class CheckValidationToken {
  async isTokenValid(token: string) {
    const invalidToken = await db.blackListToken.findFirst({
      where: {
        token
      }
    });

    return {
      invalidToken
    }
  }
}

export default new CheckValidationToken();
