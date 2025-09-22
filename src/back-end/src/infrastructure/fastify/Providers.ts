import { FastifyInstance } from "fastify";
import { GoogleOAuth } from "@user/infra/auth/GoogleAuth";

export function configureProvaders(app: FastifyInstance) {
  const googleOAuth = new GoogleOAuth(
    "/api/user/auth/google/",
    process.env.GOOGLE_CALLBACK_URL ||
      "http://localhost:8080/api/user/auth/google/callback"
  );
  googleOAuth.setup(app);
}
