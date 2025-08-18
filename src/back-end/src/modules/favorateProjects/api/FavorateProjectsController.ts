import { TYPES } from "@compositionRoot/Types";
import { IFavorateProjectsService } from "@favorateProjects/domain/interfaces/IFavorateProjectsService";
import { FastifyReply } from "fastify";
import { inject, injectable } from "inversify";
import {
  CreateFavorateProjectRequest,
  DeleteFavorateProjectRequest,
} from "@favorateProjects/api/FavorateProjectsSchema";
import {
  CreateFavorateProjectDTO,
  DeleteFavorateProjectDTO,
} from "@favorateProjects/api/FavorateProjectsDTO";
import { Unauthorized } from "@shared/error/HttpError";

@injectable()
export class FavorateProjectsController {
  constructor(
    @inject(TYPES.IFavorateProjectsService)
    private service: IFavorateProjectsService
  ) {}

  async create(req: CreateFavorateProjectRequest, reply: FastifyReply) {
    const user = req.user;

    if (!user) throw new Unauthorized("O usuario precisa estar lógado!");

    const dto: CreateFavorateProjectDTO = {
      projectId: req.body.project,
      userId: user.id,
    };

    await this.service.create(dto);

    reply
      .status(201)
      .send({ msg: "Projeto adicionados aos favoritos com sucesso." });
  }

  async delete(req: DeleteFavorateProjectRequest, reply: FastifyReply) {
    const user = req.user;

    if (!user) throw new Unauthorized("O usuario precisa estar lógado!");

    const dto: DeleteFavorateProjectDTO = {
      userId: user.id,
      projectId: req.params.projectId,
    };

    await this.service.delete(dto);

    reply.send({ msg: "Projeto removido do favoritos com sucesso." });
  }
}
