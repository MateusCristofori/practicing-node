import mongoose from "mongoose";

export const passwordRecoveryToken = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  used: {
    type: Boolean,
    required: true
  }
})

export default mongoose.model('recovery tokens', passwordRecoveryToken);