export class ApiError extends Error{
 
  constructor(msg: string, public readonly statusCode?: number){
    super(msg);
    this.statusCode = statusCode;
  }
}