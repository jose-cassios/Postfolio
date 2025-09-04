// import { Container } from "inversify";
// import { TYPES } from "@compositionRoot/Types";

// import { IMessageService } from "@chat/domain/interfaces/IMessageService";
// import { IMessageRepository } from "@chat/domain/interfaces/IMessageRepository";
// import { IUsersConnects } from "@chat/domain/interfaces/IUsersConnects";

// import { MessageService } from "@chat/application/MessageService";
// import { UsersConnects } from "@chat/application/UsersConnects";
// import { MessageRepository } from "@chat/infra/database/MessageRepository";

// import { ChatController } from "@chat/api/ChatController";

// export function chatComposerModule(container: Container) {
//   container
//     .bind<IMessageRepository>(TYPES.IMessageRepository)
//     .to(MessageRepository)
//     .inRequestScope();
//   container
//     .bind<IMessageService>(TYPES.IMessageService)
//     .to(MessageService)
//     .inRequestScope();
//   container
//     .bind<IUsersConnects>(TYPES.IUsersConnects)
//     .to(UsersConnects)
//     .inRequestScope();
//   container
//     .bind<ChatController>(TYPES.ChatController)
//     .to(ChatController)
//     .inRequestScope();
// }
