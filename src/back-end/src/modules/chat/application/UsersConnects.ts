// import { WebSocket } from "ws";
// import { IUsersConnects } from "@chat/domain/interfaces/IUsersConnects";
// import { injectable } from "inversify";

// @injectable()
// export class UsersConnects implements IUsersConnects {
//   private socketsActive = new Map<string, WebSocket>();

//   async connection(userId: string, socket: WebSocket): Promise<boolean> {
//     try {
//       this.socketsActive.set(userId, socket);
//       return true;
//     } catch (error) {
//       return false;
//     }
//   }

//   async getConnection(userId: string): Promise<WebSocket | null> {
//     const socket = await this.socketsActive.get(userId);

//     return socket ? socket : null;
//   }

//   async deleteConnection(userId: string): Promise<boolean> {
//     return this.socketsActive.delete(userId);
//   }
// }
