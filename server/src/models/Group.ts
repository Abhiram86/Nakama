import mongoose from "mongoose";

const { Schema } = mongoose;

const GroupSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
  },
  groupIcon: {
    type: String,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  messageIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "messages",
    },
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Users",
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

const groupdb = mongoose.model("groups", GroupSchema);

export default groupdb;
