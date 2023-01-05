export class ApiError extends Error {
  constructor(msg: string, public readonly statusCode?: number){
    super(msg);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends ApiError {
  constructor(msg: string) {
    super(msg, 400);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(msg: string) {
    super(msg, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(msg: string) {
    super(msg, 403)
  }
}

export class NotFoundError extends ApiError {
  constructor(msg: string) {
    super(msg, 404);
  }
}