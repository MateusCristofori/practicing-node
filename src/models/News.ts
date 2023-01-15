import mongoose, { Schema } from "mongoose";

export const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
})

export default mongoose.model('news', newsSchema);