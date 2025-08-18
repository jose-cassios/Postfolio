// import { Message } from "@chat/domain/entities/Message";
// import { MessageStatus } from "@chat/domain/enum/MessageStatus";

// export interface IMessageRepository {
//   create(msg: Message): Promise<Message>;
//   update(msg: Message): Promise<Message>;
//   updateManyStatus(msg: Message[]): Promise<void>;
//   delete(id: string): Promise<Message | null>;

//   findById(id: string): Promise<Message | null>;
//   findByUser(userId: string): Promise<Message[]>;
//   findByUserAndStatus(
//     userId: string,
//     status: MessageStatus
//   ): Promise<Message[]>;

//   findConversationMessagesBefore(
//     user1Id: string,
//     user2Id: string,
//     options: { limit: number; date: Date }
//   ): Promise<Message[]>;

//   findConversationMessagesAfter(
//     user1Id: string,
//     user2Id: string,
//     options: { limit: number; date: Date }
//   ): Promise<Message[]>;
// }
