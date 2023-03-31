import { db } from "../../database/prisma";

class CheckValidationToken {
  async isTokenValid(token: string) {
    const invalidToken = await db.blackListToken.findFirst({
      where: {
        token,
      },
    });

    if (invalidToken?.token) {
      return true;
    }

    return false;
  }
}

export default new CheckValidationToken();
