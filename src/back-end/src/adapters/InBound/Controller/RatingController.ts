import { FastifyReply, FastifyRequest } from "fastify";
import { HttpError } from "../../../Infrastructure/Error/HttpError";
import Rating from "../../../Domain/Entities/Rating/Rating";
import ratingService from "../../../Application/Service/RatingServiceImp";

export const RatingController = {
  register: async (req: FastifyRequest, reply: FastifyReply) => {
    const {
      userId = req.user?.id,
      portfolioId = null,
      score = null,
    } = req.body as Partial<{
      userId: string;
      portfolioId: string;
      score: string;
    }>;

    if (!userId || !portfolioId || !score)
      throw new HttpError(400, "Todos os campos são obrigatórios!");

    const scoreNumber = Number(score);

    await ratingService.register(
      new Rating("", userId, portfolioId, scoreNumber)
    );

    return reply.send({ msg: "Analise criada com sucesso!" });
  },

  getAll: async (req: FastifyRequest, reply: FastifyReply) => {
    const allRatings = await ratingService.findMany();
    reply.send(allRatings);
  },

  update: async (req: FastifyRequest, reply: FastifyReply) => {
    const {
      userId = req.user?.id,
      portfolioId = null,
      score = null,
    } = req.body as Partial<{
      userId: string;
      portfolioId: string;
      score: string;
    }>;

    if (!userId || !portfolioId || !score)
      throw new HttpError(400, "Todos os campos são obrigatórios!");

    const existingRating = await ratingService.findByUserAndPortfolio(
      userId,
      portfolioId
    );

    if (!existingRating)
      throw new HttpError(
        404,
        "Avaliação não encontrado para o usuário e portfólio informados."
      );

    const newScore = Number(score);

    const rating = new Rating(
      existingRating.portfolioId,
      userId,
      portfolioId,
      newScore
    );
    await ratingService.update(rating);

    reply.send({ msg: "Atualização bem sucedida!", rating: rating });
  },

  delete: async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.id;

    const params = req.params as { portfolioId: string };
    const portfolioId = params.portfolioId;

    if (!portfolioId)
      throw new HttpError(400, "Id do portofolio é obrigatorio!");

    if (!userId) throw new HttpError(400, "Id do usuario é obrigatorio!");

    const existingRating = await ratingService.findByUserAndPortfolio(
      userId,
      portfolioId
    );

    if (!existingRating)
      throw new HttpError(
        404,
        "Avaliação não encontrado para o usuário e portfólio informados."
      );

    const rating = await ratingService.delete(existingRating.id);

    reply.send(rating);
  },
};
