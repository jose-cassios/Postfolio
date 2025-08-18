// import { IMessageRepository } from "@chat/domain/interfaces/IMessageRepository";
// import { Message } from "@chat/domain/entities/Message";
// import { SendMessageDTO, UpdateMessageDTO } from "@chat/api/MessageDTO";
// import { IMessageService } from "@chat/domain/interfaces/IMessageService";
// import { TYPES } from "@compositionRoot/Types";
// import { inject, injectable } from "inversify";
// import { IUsersConnects } from "@chat/domain/interfaces/IUsersConnects";
// import { MessageMapper } from "@chat/application/MessageMapper";
// import { MessageStatus } from "@chat/domain/enum/MessageStatus";
// import { BadRequest, NotFound } from "@shared/error/HttpError";
// import { WebSocket } from "ws";

// @injectable()
// export class MessageService implements IMessageService {
//   constructor(
//     @inject(TYPES.IMessageRepository)
//     private messageRepository: IMessageRepository,
//     @inject(TYPES.IUsersConnects)
//     private usersConnects: IUsersConnects
//   ) {}

//   async sendMessage(sendMessageDto: SendMessageDTO): Promise<void> {
//     const message = MessageMapper.fromSendMessageDTOtoDomain(sendMessageDto);

//     const socket = await this.usersConnects.getConnection(
//       sendMessageDto.toUserId
//     );

//     if (!socket) {
//       await this.messageRepository.create(message);
//       sendMessageDto.socket.send("O usuario está offline");
//       return;
//     }

//     message.setStatus(MessageStatus.RECEIVED);
//     const id = (await this.messageRepository.create(message)).getId();
//     socket.send(
//       JSON.stringify({
//         msgId: id,
//         from: message.senderId,
//         text: message.getContent(),
//         timestamp: message.createAt,
//       })
//     );
//   }

//   async updateMessage(updateMessageDto: UpdateMessageDTO): Promise<void> {
//     const msg = await this.messageRepository.findById(updateMessageDto.id);

//     if (!msg) throw new NotFound("A menssagem não existe!");

//     await this.messageRepository.update(msg);
//   }

//   async processOfflineMessages(userId: string): Promise<void> {
//     const socket = await this.usersConnects.getConnection(userId);

//     if (!socket) {
//       throw new BadRequest("O socket do usuario não registrado!");
//     }

//     const messages = await this.messageRepository.findByUserAndStatus(
//       userId,
//       MessageStatus.UNRECEIVED
//     );

//     messages.forEach((msg) => {
//       if (socket.readyState == WebSocket.OPEN) {
//         socket.send(
//           JSON.stringify({
//             msgId: msg.getId(),
//             type: "offline",
//             from: msg.senderId,
//             text: msg.getContent(),
//             timestamp: msg.createAt,
//           })
//         );

//         msg.setStatus(MessageStatus.RECEIVED);
//       }
//     });

//     await this.messageRepository.updateManyStatus(messages);
//   }

//   async getConversationHistory(
//     user1Id: string,
//     user2Id: string,
//     options: { limit: number; date: Date; direction: "before" | "after" }
//   ): Promise<Message[]> {
//     if (options.direction === "before") {
//       return await this.messageRepository.findConversationMessagesBefore(
//         user1Id,
//         user2Id,
//         { limit: options.limit, date: options.date }
//       );
//     }

//     if (options.direction === "after") {
//       return await this.messageRepository.findConversationMessagesAfter(
//         user1Id,
//         user2Id,
//         { limit: options.limit, date: options.date }
//       );
//     }

//     throw new NotFound("Operação não implemendata!");
//   }

//   async markMessageAsRead(messageId: string, userId: string): Promise<void> {
//     const msg = await this.messageRepository.findById(messageId);

//     if (!msg) throw new NotFound("A menssagem não existe!");

//     if (msg.receiverId != userId) return;
//     msg.setStatus(MessageStatus.READ);
//     await this.messageRepository.update(msg);
//   }
// }
