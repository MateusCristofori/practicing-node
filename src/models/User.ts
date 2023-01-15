import mongoose, { Schema } from "mongoose";

export enum Roles {
  ADMIN = "admin",
  CREATOR = "creator",
  READER = "reader",
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
    type: String,
    enum: Roles,
    default: Roles.READER
  }
});

export default mongoose.model('users', userSchema);