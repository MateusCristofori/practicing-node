import jwt from "jsonwebtoken";

export const generateAccessToken = async (
  id: string,
  name: string,
  email: string
) => {
  return jwt.sign(
    {
      user: {
        id: id,
        name: name,
        email: email,
      },
    },
    process.env.SECRET as string,
    {
      expiresIn: "1d",
    }
  );
};
