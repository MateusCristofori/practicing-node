import mongoose, { Document, Schema } from "mongoose";

export interface RefreshToken extends Document{
  token: {
    type: string,
    required: boolean
  }
}

const refreshTokenSchema = new Schema<RefreshToken>({
  token: {
    type: String,
    required: true
  }
});


export default mongoose.model('black list tokens', refreshTokenSchema);