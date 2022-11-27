import { Response } from "express"
import { IRequestWithToken } from "../../interfaces/IRequestWithToken"

export const dashboardHandler = async (request: IRequestWithToken, response: Response) => {


  response.status(200).json({msg: "Seja bem-vindo ao dashboard!", token: request.token})

}