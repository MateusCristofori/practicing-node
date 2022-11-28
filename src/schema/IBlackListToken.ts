import mongoose, { Document, Schema } from "mongoose";

export interface IBlackListToken extends Document{
  token: string 
}

const invalidTokenSchema = new Schema({
  token: {
    type: String,
    required: true
  }
});

export default mongoose.model('blackLisToken', invalidTokenSchema);