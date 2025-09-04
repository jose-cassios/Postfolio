// import { Message } from "@chat/domain/entities/Message";
// import { SendMessageDTO, UpdateMessageDTO } from "@chat/api/MessageDTO";

// export interface IMessageService {
//   sendMessage(sendMessageDto: SendMessageDTO): Promise<void>;
//   updateMessage(updateMessageDto: UpdateMessageDTO): Promise<void>;

//   processOfflineMessages(userId: string): Promise<void>;

//   getConversationHistory(
//     user1Id: string,
//     user2Id: string,
//     options: { limit: number; date: Date; direction: "before" | "after" }
//   ): Promise<Message[]>;
//   markMessageAsRead(messageId: string, userId: string): Promise<void>;
// }
