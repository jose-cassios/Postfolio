import { FastifyReply, FastifyRequest } from "fastify";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  NotFound,
} from "@shared/error/HttpError";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "@user/api/UserDTO";
import {
  LoginRequest,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserRoleRequest,
  UpdateReputationRankConfigRequest,
  PublicProfileRequest,
} from "@user/api/UserSchema";
import { IUserService } from "@user/domain/interfaces/IUserService";
import { inject, injectable } from "inversify";
import { TYPES } from "@compositionRoot/Types";
import jwt from "jsonwebtoken";
import { GoogleUserPayload } from "@infrastructure/types/fastify";
import { UserTypeMapper } from "@user/application/UserMapper";
import { UserType } from "@user/domain/enum/UserType";

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.IUserService)
    private userService: IUserService
  ) {}

  async hello(req: FastifyRequest, reply: FastifyReply) {
    reply.send({ msg: "Ola mundo" });
  }

  async getAll(req: FastifyRequest, reply: FastifyReply) {
    const requester = req.user?.id
      ? await this.userService.findById(req.user.id)
      : null;
    if (requester?.getUserType() !== UserType.ADMIN) {
      throw new Forbidden("Apenas administradores podem listar usuarios.");
    }
    const allUsers = await this.userService.findMany();
    reply.send(
      allUsers.map((user) => ({
        id: user.getId(),
        username: user.getUsername(),
        email: user.getEmail().getValue(),
        bio: user.getBio(),
        linkedin: user.getLinkedin(),
        github: user.getGithub(),
        website: user.getWebsite(),
        profilePhoto: user.getProfilePhoto(),
        coverPhoto: user.getCoverPhoto(),
        availableForHire: user.isAvailableForHire(),
        usertype: UserTypeMapper.fromDomainToPrisma(user.getUserType()),
        active: user.isActive(),
      }))
    );
  }

  async setActive(req: FastifyRequest, reply: FastifyReply) {
    const requesterId = req.user?.id;
    const { id } = req.params as { id?: string };
    const { active } = req.body as { active?: boolean };
    if (!requesterId || !id || typeof active !== "boolean") {
      throw new BadRequest("Usuario e status sao obrigatorios.");
    }
    const requester = await this.userService.findById(requesterId);
    if (requester?.getUserType() !== UserType.ADMIN) {
      throw new Forbidden("Apenas administradores podem moderar usuarios.");
    }
    if (requesterId === id && !active) {
      throw new BadRequest("Voce nao pode suspender a propria conta.");
    }
    const user = await this.userService.setActive(id, active);
    reply.send({ id: user.getId(), active: user.isActive() });
  }

  async setRole(req: UpdateUserRoleRequest, reply: FastifyReply) {
    const requesterId = req.user?.id;
    const { id } = req.params;
    if (!requesterId) throw new BadRequest("Usuario autenticado e obrigatorio.");
    if (requesterId === id) {
      throw new BadRequest("Voce nao pode alterar o proprio papel.");
    }

    const requester = await this.userService.findById(requesterId);
    if (requester?.getUserType() !== UserType.ADMIN) {
      throw new Forbidden("Apenas administradores podem alterar papeis.");
    }

    const user = await this.userService.setUserType(
      id,
      UserTypeMapper.fromSchemaToDto(req.body.usertype),
    );
    reply.send({
      id: user.getId(),
      usertype: UserTypeMapper.fromDomainToPrisma(user.getUserType()),
    });
  }

  async getReputationRankConfig(req: FastifyRequest, reply: FastifyReply) {
    await this.requireAdmin(req.user?.id);
    reply.send(await this.userService.findReputationRankConfig());
  }

  async updateReputationRankConfig(
    req: UpdateReputationRankConfigRequest,
    reply: FastifyReply,
  ) {
    await this.requireAdmin(req.user?.id);
    reply.send(await this.userService.updateReputationRankConfig(req.body.ranks));
  }

  async create(req: CreateUserRequest, reply: FastifyReply) {
    const userDto: CreateUserDTO = {
      ...req.body,
      userType: UserType.USER,
    };

    await this.userService.create(userDto);

    return reply
      .status(201)
      .send({ msg: "Usuario criado com sucesso!", userDto });
  }

  async updateById(req: UpdateUserRequest, reply: FastifyReply) {
    const id = req.params.id;

    if (req.user?.id !== id) {
      throw new Forbidden("Voce so pode editar o proprio perfil.");
    }

    const dto: UpdateUserDTO = {
      ...req.body,
      id,
    };

    const user = await this.userService.updateById(dto);

    const type = user.getUserType()
      ? UserTypeMapper.fromDomainToPrisma(user.getUserType())
      : null;

    reply.send({
      id: user.getId(),
      username: user.getUsername(),
      email: user.getEmail().getValue(),
      bio: user.getBio(),
      linkedin: user.getLinkedin(),
      github: user.getGithub(),
      website: user.getWebsite(),
      profilePhoto: user.getProfilePhoto(),
      coverPhoto: user.getCoverPhoto(),
      availableForHire: user.isAvailableForHire(),
      usertype: type,
    });
  }

  async deleteById(req: FastifyRequest, reply: FastifyReply) {
    const id = req.user?.id;
    if (!id) throw new BadRequest("Id do usuario é obrigatorio!");

    const user = await this.userService.deleteById(id);
    reply.send(user);
  }

  async getByEmail(req: FastifyRequest, reply: FastifyReply) {
    throw new InternalServerError("Método não implementado!");
  }

  async login(req: LoginRequest, reply: FastifyReply) {
    const loginDto = req.body as LoginUserDTO;

    const token = await this.userService.login(loginDto);

    reply.send({ msg: "Login bem-sucedido!", token });
  }

  async socialLogin(req: FastifyRequest, reply: FastifyReply) {
    req.server.googleOAuth2.generateAuthorizationUri(
      req,
      reply,
      (err, authorizationEndpoint) => {
        if (err) console.error(err);
        reply.redirect(authorizationEndpoint);
      }
    );
  }

  async socialLoginCallBack(req: FastifyRequest, reply: FastifyReply) {
    const app = req.server;

    const tokenAuthorization =
      await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);

    const id_token = tokenAuthorization.token.id_token;

    if (!id_token) throw new BadRequest("Token não definido!");

    const userPayload = jwt.decode(id_token) as GoogleUserPayload;

    const dto: CreateUserDTO = {
      username: userPayload.name,
      email: userPayload.email,
      userType: UserType.USER,
    };

    const token = await this.userService.socialLogin(dto);

    reply.send({ msg: "Login bem-sucedido!", token });
  }

  async getProfile(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user?.id) throw new InternalServerError("Autenticação falhou");
    const user = await this.userService.findById(req.user?.id);

    if (!user) throw new BadRequest("Id do usuario não existe");

    const userType = user.getUserType();
    const [achievements, reputation] = await Promise.all([
      this.userService.findAchievements(user.getId()),
      this.userService.findReputation(user.getId()),
    ]);

    reply.send({
      msg: "Perfil do usuário",
      data: {
        id: user.getId(),
        username: user.getUsername(),
        email: user.getEmail().getValue(),
        bio: user.getBio(),
        linkedin: user.getLinkedin(),
        github: user.getGithub(),
        website: user.getWebsite(),
        profilePhoto: user.getProfilePhoto(),
        coverPhoto: user.getCoverPhoto(),
        availableForHire: user.isAvailableForHire(),
        usertype: userType ? UserTypeMapper.fromDomainToPrisma(userType) : null,
        achievements,
        reputation,
      },
    });
  }

  async getPublicProfile(req: PublicProfileRequest, reply: FastifyReply) {
    const user = await this.userService.findByUsername(req.params.username);

    if (!user) throw new NotFound("Perfil nao encontrado.");

    const userType = user.getUserType();
    const [achievements, reputation] = await Promise.all([
      this.userService.findAchievements(user.getId()),
      this.userService.findReputation(user.getId()),
    ]);
    reply.send({
      data: {
        id: user.getId(),
        username: user.getUsername(),
        bio: user.getBio(),
        linkedin: user.getLinkedin(),
        github: user.getGithub(),
        website: user.getWebsite(),
        profilePhoto: user.getProfilePhoto(),
        coverPhoto: user.getCoverPhoto(),
        availableForHire: user.isAvailableForHire(),
        usertype: userType ? UserTypeMapper.fromDomainToPrisma(userType) : null,
        achievements,
        reputation,
      },
    });
  }

  private async requireAdmin(userId?: string): Promise<void> {
    const requester = userId ? await this.userService.findById(userId) : null;
    if (requester?.getUserType() !== UserType.ADMIN) {
      throw new Forbidden("Apenas administradores podem alterar a configuracao de ranks.");
    }
  }
}
