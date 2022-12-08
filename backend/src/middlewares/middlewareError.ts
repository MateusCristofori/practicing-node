import { NextFunction, Request, Response } from "express"
import { ApiError } from "../helpers/api_error";

export const middlewareError = (error: Error & ApiError, request: Request, response: Response, next: NextFunction) => {
  const statusCode: number = error.statusCode ?? 500;
  const errorMessage = error.statusCode ? error.message : "Internal server error.";



  response.status(statusCode).json({msg: errorMessage});
  next();
}