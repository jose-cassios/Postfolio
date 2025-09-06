import { app } from "../src/app";

export default async (req: any, res: any) => {
  try {
    await app.ready();
    app.server.emit("request", req, res);
  } catch (error) {
    console.error("Não foi possivel emitir a requisição. err: ", error);
    res.status(500).send("Não foi possivel emitir a requisição.");
  }
};
