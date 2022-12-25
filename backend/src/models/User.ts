import mongoose, { Document, Schema } from "mongoose";
import { Replace } from "../helpers/replace/replace";

export enum Permissions {
  
  ADMINISTRATOR,

  MANAGER,

  READER,
}

export interface User extends Document {
  name: {
    type: string,
    required: boolean
  },
  email: {
    type: string,
    required: boolean,
  },
  password: {
    type: string,
    required: boolean
  },
}

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

export default mongoose.model('users', userSchema);