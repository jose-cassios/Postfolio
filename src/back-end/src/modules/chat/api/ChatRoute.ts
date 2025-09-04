// import { FastifyInstance } from "fastify";
// import { ChatController } from "@chat/api/ChatController";
// import { UserMiddle } from "@infrastructure/middleware/UserMiddle";
// import { GetMessageRequest, messageRouteSchema } from "@chat/api/ChatShema";

// function chatRoutePlugin(app: FastifyInstance, chatController: ChatController) {
//   app.get(
//     "",
//     {
//       websocket: true,
//       preValidation: UserMiddle.authenticate,
//     },
//     (req, rep) => chatController.connect(req, rep)
//   );

//   app.post(
//     "/conversation/:otherUser",
//     { schema: messageRouteSchema.get, preValidation: UserMiddle.authenticate },
//     (req: GetMessageRequest, rep) => chatController.conversation(req, rep)
//   );
// }

// export class ChatRoute {
//   public static register(app: FastifyInstance, chatController: ChatController) {
//     app.register((data) => chatRoutePlugin(data, chatController), {
//       prefix: "api/chat",
//     });
//   }
// }
