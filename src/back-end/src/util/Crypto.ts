import bcrypt from "bcrypt";
import {
  BadRequest,
  InternalServerError,
  Unauthorized,
} from "@domain/error/HttpError";

export const Crypt = {
  hashPassWord: async (passWord: string): Promise<string> => {
    if (!passWord || typeof passWord !== "string")
      throw new Unauthorized("Senha não é valido.");

    try {
      const saltRounds = 12;
      const hashPassWord = await bcrypt.hash(passWord, saltRounds);

      return hashPassWord;
    } catch (error) {
      throw new InternalServerError("Não foi possivel criptografar a senha.");
    }
  },
  compare: async (data: string, encrypted: string): Promise<boolean> => {
    if (!data || typeof data !== "string")
      throw new BadRequest("Não é possivel verificar senha!");

    if (!encrypted || typeof encrypted !== "string")
      throw new BadRequest("Não é possivel verificar senha!");

    const checkPassWord = await bcrypt.compare(data, encrypted);
    return checkPassWord;
  },
};
