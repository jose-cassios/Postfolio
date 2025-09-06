import { app } from "./app";

// export default async function handler(req: any, res: any) => {
//   try {
//     await app.ready();
//     app.server.emit("request", req, res);
//   } catch (error) {
//     console.error("Não foi possivel emitir a requisição. err: ", error);
//     res.status(500).send("Não foi possivel emitir a requisição.");
//   }
// };

// const app = Fastify({
//   logger: true,
// });

// app.get("/", async (req, reply) => {
//   return reply.status(200).send({ msg: "Deu certo" });
// });

async function handler(req: any, res: any) {
  await app.ready();
  app.server.emit("request", req, res);
}
export default handler;
// export default app;

// export default async (req: FastifyRequest, res: FastifyReply) => {
//   try {
//     await app.ready();
//     app.server.emit("request", req, res);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// };
