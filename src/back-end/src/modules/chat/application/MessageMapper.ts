// import { Message } from "@chat/domain/entities/Message";
// import { MessageStatus } from "@chat/domain/enum/MessageStatus";
// import { SendMessageDTO } from "@chat/api/MessageDTO";
// import { Message as MessageModel } from "@prisma/client";
// import { MessageStatus as MessageStatusModel } from "@prisma/client";

// export const MessageStatusMapper = {
//   fromDomainToPrisma(status: MessageStatus): MessageStatusModel {
//     switch (status) {
//       case MessageStatus.READ:
//         return MessageStatusModel.READ;
//       case MessageStatus.UNREAD:
//         return MessageStatusModel.UNREAD;
//       case MessageStatus.RECEIVED:
//         return MessageStatusModel.RECEIVED;
//       case MessageStatus.UNRECEIVED:
//         return MessageStatusModel.UNRECEIVED;
//     }
//   },

//   fromPrismaToDomain(status: MessageStatusModel): MessageStatus {
//     switch (status) {
//       case MessageStatusModel.READ:
//         return MessageStatus.READ;
//       case MessageStatusModel.UNREAD:
//         return MessageStatus.UNREAD;
//       case MessageStatusModel.RECEIVED:
//         return MessageStatus.RECEIVED;
//       case MessageStatusModel.UNRECEIVED:
//         return MessageStatus.UNRECEIVED;
//     }
//   },
// };

// export const MessageMapper = {
//   fromSendMessageDTOtoDomain(dto: SendMessageDTO): Message {
//     return new Message("", dto.text, dto.fromUserId, dto.toUserId);
//   },

//   fromDomainToPrisma(msg: Message): MessageModel {
//     return {
//       id: msg.getId(),
//       content: msg.getContent(),
//       status: MessageStatusMapper.fromDomainToPrisma(msg.getStatus()),
//       createAt: msg.createAt,
//       updateAt: msg.updateAt,
//       senderId: msg.senderId,
//       receiverId: msg.receiverId,
//     };
//   },
//   fromPrismaToDomain(msg: MessageModel): Message {
//     return new Message(
//       msg.id,
//       msg.content,
//       msg.senderId,
//       msg.receiverId,
//       MessageStatusMapper.fromPrismaToDomain(msg.status),
//       msg.createAt,
//       msg.updateAt
//     );
//   },
// };
