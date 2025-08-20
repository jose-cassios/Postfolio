import { FastifyReply, FastifyRequest } from "fastify";
import { BadRequest, InternalServerError } from "@shared/error/HttpError";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "@user/api/UserDTO";
import {
  LoginRequest,
  CreateUserRequest,
  UpdateUserRequest,
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
    const allUsers = await this.userService.findMany();
    reply.send(allUsers);
  }

  async create(req: CreateUserRequest, reply: FastifyReply) {
    const userDto: CreateUserDTO = {
      ...req.body,
      userType: UserTypeMapper.fromSchemaToDto(req.body.usertype),
    };

    await this.userService.create(userDto);

    return reply
      .status(201)
      .send({ msg: "Usuario criado com sucesso!", userDto });
  }

  async updateById(req: UpdateUserRequest, reply: FastifyReply) {
    const id = req.params.id;
    const userType = req.body.usertype
      ? UserTypeMapper.fromSchemaToDto(req.body.usertype)
      : undefined;

    const dto: UpdateUserDTO = {
      ...req.body,
      userType: userType,
      id,
    };

    const user = await this.userService.updateById(dto);

    reply.send({
      id: user.getId(),
      username: user.getUsername(),
      email: user.getEmail().getValue(),
      bio: user.getBio(),
      linkedin: user.getLinkedin(),
      github: user.getGithub(),
      website: user.getWebsite(),
      userType: UserTypeMapper.fromDomainToPrisma(user.getUserType()),
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
      userType: UserType.DEVELOPER,
    };

    const token = await this.userService.socialLogin(dto);

    reply.send({ msg: "Login bem-sucedido!", token });
  }

  async getProfile(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user?.id) throw new InternalServerError("Autenticação falhou");
    const user = await this.userService.findById(req.user?.id);

    if (!user) throw new BadRequest("Id do usuario não existe");

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
        userType: UserTypeMapper.fromDomainToPrisma(user.getUserType()),
      },
    });
  }
}
