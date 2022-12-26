import mongoose, { Schema } from "mongoose";

export enum Roles {
  ADMIN,
  CREATER,
  READER,
}

export const userSchema = new Schema({
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
  role: {
    type: typeof Roles,
    required: true,
  }
});

export default mongoose.model('users', userSchema);