import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
  },
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "groups",
    },
  ],
});

const userdb = mongoose.model("Users", UserSchema);

export default userdb;
