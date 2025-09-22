// import { IMessageService } from "@chat/domain/interfaces/IMessageService";
// import { IUsersConnects } from "@chat/domain/interfaces/IUsersConnects";
// import { TYPES } from "@compositionRoot/Types";
// import { FastifyReply, FastifyRequest } from "fastify";
// import { GetMessageRequest } from "@chat/api/ChatShema";
// import { inject, injectable } from "inversify";
// import { WebSocket } from "ws";
// import { BadRequest, Unauthorized } from "@shared/error/HttpError";

// @injectable()
// export class ChatController {
//   constructor(
//     @inject(TYPES.IMessageService)
//     private messageService: IMessageService,
//     @inject(TYPES.IUsersConnects)
//     private usersConnects: IUsersConnects
//   ) {}
//   async connect(socket: WebSocket, req: FastifyRequest) {
//     // console.log("AQUI 1");
//     if (!req.user) {
//       socket.close(1008, "Autenticação falhou");
//       return;
//     }
//     // console.log("AQUI 2");

//     const user = req.user;

//     await this.usersConnects.connection(user.id, socket);
//     await this.messageService.processOfflineMessages(user.id);
//     socket.on("message", (message: string | Buffer | ArrayBuffer) => {
//       const msgContent = message.toString();

//       try {
//         const parsedMessage = JSON.parse(msgContent) as {
//           type: string;
//           toUserId: string;
//           text: string;
//         };

//         if (
//           !parsedMessage.type ||
//           !parsedMessage.toUserId ||
//           !parsedMessage.text
//         ) {
//           socket.send(
//             "Erro: Formato de mensagem JSON inválido. Campos 'type', 'to', 'text' são obrigatórios."
//           );
//           return;
//         }

//         this.messageService.sendMessage({
//           fromUserId: user.id,
//           ...parsedMessage,
//           socket,
//         });
//       } catch (error) {}
//     });

//     socket.on("close", () => {
//       this.usersConnects.deleteConnection(user.id);
//     });

//     socket.on("error", (error) => {
//       console.error(`Erro no socket do usuário ${user.id}:`, error);
//     });
//   }

//   async conversation(req: GetMessageRequest, rep: FastifyReply) {
//     const user = req.user;

//     if (!user) throw new Unauthorized("O usuario não está logado!");

//     const params = req.params;
//     const query = req.query;

//     const msgs = await this.messageService.getConversationHistory(
//       user.id,
//       params.otherUser,
//       { limit: query.limit, date: query.date, direction: query.direction }
//     );

//     rep.send(msgs);
//   }
// }
