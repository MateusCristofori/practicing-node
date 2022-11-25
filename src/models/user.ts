import mongoose, { Schema } from "mongoose";


class User {
  constructor(private nome: String, private email: String, private senha: String) {}
}

export default mongoose.model('users', new Schema(User));