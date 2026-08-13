import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { prisma } from "@infrastructure/config/Prisma";

export const UserMiddle = {
  authenticate: async (req: FastifyRequest, resply: FastifyReply) => {
    const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return resply.status(401).send({ msg: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1]; // Remove "Bearer "
    if (!token) {
      return resply.status(401).send({ msg: "Token inválido" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
      };
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { active: true },
      });
      if (!user?.active) {
        return resply.status(403).send({ msg: "Conta suspensa" });
      }
      req.user = { id: decoded.id, email: decoded.email };
    } catch (error) {
      return resply.status(401).send({ msg: "Token inválido ou expirado" });
    }
  },
};
