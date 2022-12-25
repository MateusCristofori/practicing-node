import { Permissions } from "../models/User"

export interface IUserRequestBody {
  name: string,
  email: string,
  password: string
  permissions: Permissions
}