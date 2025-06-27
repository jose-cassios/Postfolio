import { GenericHttpError } from "@domain/error/HttpError";
import { FastifyReply, FastifyRequest } from "fastify";

interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  details?: any;
  timestamp?: string;
}

export default function configureErrorHandling(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  //   console.log("Error");
  const response: ErrorResponse = {
    statusCode: 500,
    error: "Internal Server Error",
    message: "Ocorreu um erro inesperado",
    timestamp: new Date().toISOString(),
  };

  // Tratamento para erros conhecidos
  if (error instanceof GenericHttpError) {
    response.statusCode = error.statusCode;
    response.error = error.name;
    response.message = error.message;
  }

  request.log.error(
    {
      err: error, // Campo especial que o Pino reconhece
      reqId: request.id,
      path: request.url,
      params: request.params,
      query: request.query,
    },
    error.message
  );

  reply.status(response.statusCode).send(response);
}
