import express from "express";
import userdb from "../../models/User";
import { Server } from "socket.io";
import { isValidObjectId } from "mongoose";

const userRouter = express.Router();

userRouter.patch("/edit", async (req, res) => {
  const { id, name, imgURL } = req.body as {
    id: string;
    name?: string;
    imgURL?: string;
  };
  const user = await userdb.findOne({ _id: id });
  if (!user) {
    return res.status(400).json({ msg: "userNotFound" });
  }
  if (name && name.length > 0) {
    user.name = name;
  }
  if (imgURL && imgURL.length > 0) {
    user.profile = imgURL;
  }
  await user.save();
  return res.status(200).json({ msg: "userUpdated" });
});

userRouter.post("/allGroups", async (req, res) => {
  const { id } = req.body as { id: string };
  if (isValidObjectId(id) === false) {
    return res.status(400).json({ msg: "invalidId" });
  }
  const user = await userdb.findById(id);
  if (!user) {
    return res.status(404).json({ msg: "userNotFound" });
  }
  return res.status(200).json({ groups: user.groups });
});

export default userRouter;
