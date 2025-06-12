import { FastifyReply, FastifyRequest } from "fastify";
import { HttpError } from "../../../Infrastructure/Error/HttpError";
import User from "../../../Domain/Entities/User/User";
import userService from "../../../Application/Service/UserServiceImp";
// import { Uuid } from "../../../Util/Uuid";

export const UserController = {
  register: async (req: FastifyRequest, reply: FastifyReply) => {
    const {
      name = null,
      email = null,
      passWord = null,
      status = null,
    } = req.body as Partial<{
      name: string;
      email: string;
      passWord: string;
      status: string;
    }>;

    if (!name || !email || !passWord || !status)
      throw new HttpError(400, "Todos os campos são obrigatórios!");

    await userService.register(new User("", name, email, passWord, status));

    return reply.send({ msg: "Usuario criado com sucesso!" });
  },
  getAll: async (req: FastifyRequest, reply: FastifyReply) => {
    const allUsers = await userService.findMany();
    reply.send(allUsers);
  },

  getByEmail: async (req: FastifyRequest, reply: FastifyReply) => {
    throw new HttpError(500, "Método não implementado!");
    // if (!email) throw new HttpError(400, "O email é obrigatório!");
    // const userService = UserService(UserRepository);
    // try {
    //   const user = await userService.findByEmail(email);
    //   return reply.send(user);
    // } catch (error) {
    //   const err = error as Error;
    //   reply.status(400).send({ msg: err.message });
    // }
  },

  login: async (req: FastifyRequest, reply: FastifyReply) => {
    const { email = null, passWord = null } = req.body as Partial<{
      email: string;
      passWord: string;
    }>;

    if (!email) throw new HttpError(400, "O email é obrigatório!");
    if (!passWord) throw new HttpError(400, "A senha é obrigatória!");

    const token = await userService.login(email, passWord);
    reply.send({ msg: "Login bem-sucedido!", token });
  },

  getProfile: async (req: FastifyRequest, reply: FastifyReply) => {
    reply.send({ msg: "Perfil do usuário", user: req.user });
  },

  getPortfolios: async (req: FastifyRequest, reply: FastifyReply) => {
    const authorID = req.user?.id;

    if (!authorID)
      throw new HttpError(400, "Os dados enviados não são validos!");

    const portfolios = await userService.findPortfolios(authorID);

    reply.send(portfolios);
  },

  getRatings: async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.id;
    if (!userId) throw new HttpError(400, "Id do usuario é obrigatorio!");

    const ratings = await userService.findRatings(userId);

    reply.send(ratings);
  },

  deleteById: async (req: FastifyRequest, reply: FastifyReply) => {
    const id = req.user?.id;
    if (!id) throw new HttpError(400, "Id do usuario é obrigatorio!");

    const user = await userService.deleteById(id);
    reply.send(user);
  },
};
