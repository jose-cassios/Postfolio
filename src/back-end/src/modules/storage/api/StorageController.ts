import { TYPES } from "@compositionRoot/Types";
import { IStorageService } from "@storage/domain/interfaces/IStorageService";
import { BadRequest, PayloadTooLarge } from "@shared/error/HttpError";
import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "inversify";

@injectable()
export class StorageController {
  constructor(
    @inject(TYPES.IStorageService)
    private storageService: IStorageService,
  ) {}

  async uploadImage(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequest("Usuario autenticado e obrigatorio.");
    if (!req.isMultipart()) {
      throw new BadRequest("Envie a imagem como multipart/form-data.");
    }

    try {
      const file = await req.file({ limits: { files: 1, fileSize: 8 * 1024 * 1024 } });
      if (!file) throw new BadRequest("O arquivo de imagem e obrigatorio.");

      const image = await this.storageService.uploadImage(userId, await file.toBuffer());
      reply.code(201).send(image);
    } catch (error) {
      if (error instanceof req.server.multipartErrors.RequestFileTooLargeError) {
        throw new PayloadTooLarge("A imagem deve ter no maximo 8 MB.");
      }
      throw error;
    }
  }

  async health(_req: FastifyRequest, reply: FastifyReply) {
    reply.send(await this.storageService.health());
  }
}
