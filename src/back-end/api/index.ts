// import Fastify, { FastifyReply, FastifyRequest } from "fastify";
// import { app } from "../src";

// // const app = Fastify({
// //   logger: true,
// // });

// // app.get("/", async (req, reply) => {
// //   return reply.status(200).send({ msg: "Deu certo" });
// // });

// export default async function handler(req: FastifyRequest, res: FastifyReply) {
//   try {
//     await app.ready();
//     app.server.emit("request", req, res);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// }
