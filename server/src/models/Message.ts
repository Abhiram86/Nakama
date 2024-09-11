import mongoose from "mongoose";

const { Schema } = mongoose;

const MessageSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
  },
  senderProfile: {
    type: String,
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: "Groups",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const messagedb = mongoose.model("messages", MessageSchema);
export default messagedb;
