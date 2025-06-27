export class GenericHttpError extends Error {
  constructor(public statusCode: number, public name: string, message: string) {
    super(message);
  }
}

export class BadRequest extends GenericHttpError {
  constructor(message: string) {
    super(400, "Bad Request", message);
  }
}

export class Unauthorized extends GenericHttpError {
  constructor(message: string) {
    super(401, "Unauthorized", message);
  }
}

export class TokenExpired extends Unauthorized {
  constructor() {
    super("Token de acesso expirado");
  }
}

export class Forbidden extends GenericHttpError {
  constructor(message: string) {
    super(403, "Forbidden", message);
  }
}

export class NotFound extends GenericHttpError {
  constructor(message: string) {
    super(404, "Not Found", message);
  }
}

export class Conflict extends GenericHttpError {
  constructor(message: string) {
    super(409, "Conflict", message);
  }
}

export class InternalServerError extends GenericHttpError {
  constructor(message: string) {
    super(500, "Internal Server Error", message);
  }
}
