import express from "express";
import groupdb from "../../models/Group";
import messagedb from "../../models/Message";
import { Server } from "socket.io";

const messageRouter = express.Router();

messageRouter.get("/", (req, res) => {
  res.json({ msg: "this is message route" });
});

messageRouter.post("/send", async (req, res) => {
  const io: Server | undefined = req.io;
  const { groupId, sender, senderProfile, text } = req.body;
  // console.log(groupId, sender, senderProfile, text);
  if (!groupId || !sender || !text) {
    return res.status(400).json({ msg: "missingFields" });
  }
  const group = await groupdb.findById(groupId);
  if (!group) {
    return res.status(404).json({ msg: "group not found" });
  }
  const newMessage = new messagedb({
    groupId,
    sender,
    senderProfile,
    text,
  });
  await newMessage.save();
  group.messageIds.push(newMessage._id);
  await group.save();
  if (io) {
    console.log("emitting");
    io.in(groupId).emit("newMessage", {
      message: newMessage,
    });
  }
  res.json({ msg: "ok", newMessage });
});

messageRouter.post("/all", async (req, res) => {
  const { groupId } = req.body;
  if (!groupId) {
    return res.status(400).json({ msg: "missingFields" });
  }
  const group = await groupdb.findById(groupId);
  if (!group) {
    return res.status(404).json({ msg: "group not found" });
  }
  const messagIds = group.messageIds;
  const messages = await messagedb.find({ _id: { $in: messagIds } });
  res.json({ messages });
});

export default messageRouter;
