import bcrypt from "bcrypt";

export const generatePasswordHash = async (password: string) => {
  const salt: string = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};
