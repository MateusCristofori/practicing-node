import mongoose, { Document, Schema } from "mongoose";

export interface IBlackListToken extends Document{
  token: {
    type: string,
    required: boolean
  }
}

const invalidTokenSchema = new Schema<IBlackListToken>({
  token: {
    type: String,
    required: true
  }
});

export default mongoose.model('blackLisToken', invalidTokenSchema);