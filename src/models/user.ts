import mongoose, { Schema } from "mongoose";


class User {
  constructor(private name: String, private email: String, private password: String) {}
}

export default mongoose.model('users', new Schema(User));