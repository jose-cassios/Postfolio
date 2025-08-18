// import { MessageStatus } from "@chat/domain/enum/MessageStatus";

// export class Message {
//   private id: string;
//   private content: string;
//   senderId: string;
//   receiverId: string;
//   private status: MessageStatus;
//   createAt: Date;
//   updateAt: Date;

//   constructor(
//     id: string,
//     content: string,
//     senderId: string,
//     receiverId: string,
//     status: MessageStatus = MessageStatus.UNRECEIVED,
//     createAt: Date = new Date(),
//     updateAt: Date = createAt
//   ) {
//     this.id = id;
//     this.content = content;
//     this.senderId = senderId;
//     this.receiverId = receiverId;
//     this.status = status;
//     this.createAt = createAt;
//     this.updateAt = updateAt;
//   }

//   public setStatus(status: MessageStatus) {
//     this.status = status;
//   }

//   public getStatus(): MessageStatus {
//     return this.status;
//   }

//   public getContent(): string {
//     return this.content;
//   }

//   public getId(): string {
//     return this.id;
//   }
// }
