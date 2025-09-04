// import { IMessageRepository } from "@chat/domain/interfaces/IMessageRepository";
// import { Message } from "@chat/domain/entities/Message";
// import { MessageStatus } from "@chat/domain/enum/MessageStatus";
// import {
//   MessageMapper,
//   MessageStatusMapper,
// } from "@chat/application/MessageMapper";
// import { prisma } from "@infrastructure/config/Prisma";
// import { injectable } from "inversify";

// @injectable()
// export class MessageRepository implements IMessageRepository {
//   async create(msg: Message): Promise<Message> {
//     const model = await prisma.message.create({
//       data: {
//         ...MessageMapper.fromDomainToPrisma(msg),
//         id: undefined,
//       },
//     });

//     return MessageMapper.fromPrismaToDomain(model);
//   }

//   async update(msg: Message): Promise<Message> {
//     const model = await prisma.message.update({
//       where: { id: msg.getId() },
//       data: {
//         content: msg.getContent(),
//         updateAt: new Date(),
//       },
//     });

//     return MessageMapper.fromPrismaToDomain(model);
//   }

//   async updateManyStatus(msg: Message[]): Promise<void> {
//     const updates = msg.map((msg) =>
//       prisma.message.update({
//         where: {
//           id: msg.getId(),
//         },
//         data: {
//           status: MessageStatusMapper.fromDomainToPrisma(msg.getStatus()),
//           updateAt: new Date(),
//         },
//       })
//     );

//     const results = await Promise.allSettled(updates);

//     for (const result of results) {
//       if (result.status === "rejected") {
//         console.error("Erro ao atualizar mensagem:", result.reason);
//       }
//     }
//   }

//   delete(id: string): Promise<Message | null> {
//     throw new Error("Method not implemented.");
//   }
//   async findById(id: string): Promise<Message | null> {
//     const model = await prisma.message.findUnique({ where: { id } });
//     return model ? MessageMapper.fromPrismaToDomain(model) : null;
//   }
//   findByUser(userId: string): Promise<Message[]> {
//     throw new Error("Method not implemented.");
//   }

//   async findByUserAndStatus(
//     userId: string,
//     status: MessageStatus
//   ): Promise<Message[]> {
//     const models = await prisma.message.findMany({
//       where: {
//         receiverId: userId,
//         status: MessageStatusMapper.fromDomainToPrisma(status),
//       },
//     });

//     return models.map(MessageMapper.fromPrismaToDomain);
//   }
//   async findConversationMessagesBefore(
//     user1Id: string,
//     user2Id: string,
//     options: { limit: number; date: Date }
//   ): Promise<Message[]> {
//     const models = await prisma.message.findMany({
//       where: {
//         OR: [
//           { senderId: user1Id, receiverId: user2Id },
//           { senderId: user2Id, receiverId: user1Id },
//         ],
//         createAt: {
//           lt: options.date, // mensagens ANTES da data
//         },
//       },
//       take: options.limit,
//       orderBy: {
//         createAt: "desc", // mais recentes primeiro (antes da data)
//       },
//     });

//     return models.map(MessageMapper.fromPrismaToDomain);
//   }

//   async findConversationMessagesAfter(
//     user1Id: string,
//     user2Id: string,
//     options: { limit: number; date: Date }
//   ): Promise<Message[]> {
//     const models = await prisma.message.findMany({
//       where: {
//         OR: [
//           { senderId: user1Id, receiverId: user2Id },
//           { senderId: user2Id, receiverId: user1Id },
//         ],
//         createAt: {
//           gt: options.date, // mensagens DEPOIS da data
//         },
//       },
//       take: options.limit,
//       orderBy: {
//         createAt: "asc", // mais antigas primeiro (depois da data)
//       },
//     });

//     return models.map(MessageMapper.fromPrismaToDomain);
//   }
// }
