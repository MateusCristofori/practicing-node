import mongoose, { Schema } from "mongoose";

const blackListTokenSchema = new Schema({
  token: {
    type: String,
    required: true
  }
});

export default mongoose.model('black list tokens', blackListTokenSchema);