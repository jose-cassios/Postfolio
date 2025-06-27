import { FastifyReply, FastifyRequest } from "fastify";
import { BadRequest, NotFound } from "@domain/error/HttpError";
import Rating from "@domain/entities/rating/Rating";
import RatingUseCases from "@useCases/RatingUseCases";
// import ratingService from "@application/service/RatingServiceImp";

export default class RatingControllerT {
  constructor(private readonly ratingService: RatingUseCases) {}

  async register(req: FastifyRequest, reply: FastifyReply) {
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
      throw new BadRequest("Todos os campos são obrigatórios!");

    const scoreNumber = Number(score);

    await this.ratingService.register(
      new Rating("", userId, portfolioId, scoreNumber)
    );

    return reply.send({ msg: "Analise criada com sucesso!" });
  }

  async getAll(req: FastifyRequest, reply: FastifyReply) {
    const allRatings = await this.ratingService.findMany();
    reply.send(allRatings);
  }

  async update(req: FastifyRequest, reply: FastifyReply) {
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
      throw new BadRequest("Todos os campos são obrigatórios!");

    const existingRating = await this.ratingService.findByUserAndPortfolio(
      userId,
      portfolioId
    );

    if (!existingRating)
      throw new NotFound(
        "Avaliação não encontrado para o usuário e portfólio informados."
      );

    const newScore = Number(score);

    const rating = new Rating(
      existingRating.portfolioId,
      userId,
      portfolioId,
      newScore
    );
    await this.ratingService.update(rating);

    reply.send({ msg: "Atualização bem sucedida!", rating: rating });
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;

    const params = req.params as { portfolioId: string };
    const portfolioId = params.portfolioId;

    if (!portfolioId) throw new BadRequest("Id do portofolio é obrigatorio!");

    if (!userId) throw new BadRequest("Id do usuario é obrigatorio!");

    const existingRating = await this.ratingService.findByUserAndPortfolio(
      userId,
      portfolioId
    );

    if (!existingRating)
      throw new NotFound(
        "Avaliação não encontrado para o usuário e portfólio informados."
      );

    const rating = await this.ratingService.delete(existingRating.id);

    reply.send(rating);
  }
}
