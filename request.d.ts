import "express";

declare global {
  namespace Express {
    interface Request {
      token: {
        type: string;
        user: {
          id: string;
          name: string;
          email: string;
        };
      };
    }
  }
}

export {};
