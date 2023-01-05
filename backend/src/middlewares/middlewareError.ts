import { NextFunction, Request, Response } from "express"
import { ApiError } from "../helpers/Errors/api_error";

export const middlewareError = (error: Error & Partial<ApiError>, request: Request, response: Response, next: NextFunction) => {
  const statusCode: number = error.statusCode ?? 500; // Caso tenha um status code, vamos passar esse valor para essa variável. Caso não tenha, vamos setar o valor 500 por padrão.
  const errorMessage = error.statusCode ? error.message : "Internal server error."; // Caso o atributo statusCode o error seja "true" significa que ocorreu um erro 'personalizado' e vamos atribuir o "error.message" para essa variável. Caso seja "false", vamos atribuir o valor "Internal server error"  para a variável.

  return response.status(statusCode).json({ errorMessage });
}