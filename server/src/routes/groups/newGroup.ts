import express from "express";
import groupdb from "../../models/Group";
import userdb from "../../models/User";
import messageRouter from "./messages";
import { Server } from "socket.io";
import messagedb from "../../models/Message";
import { groupCollapsed } from "console";

const groupRouter = express.Router();

groupRouter.use("/messages", messageRouter);

groupRouter.post("/new", async (req, res) => {
  const io: Server | undefined = req.io;
  const { name, members, bio, createdBy, groupIcon } = req.body as {
    name: string;
    members: string;
    bio: string;
    createdBy: string;
    groupIcon: string;
  };
  if (!name || !members || !createdBy) {
    return res.status(400).json({ msg: "missingFields" });
  }
  try {
    const group = await groupdb.findOne({ name });
    if (group) {
      return res.status(400).json({ msg: "groupAlreadyExists" });
    }
    const memberNames = members.replace(/\s+/g, "").split(",");
    console.log(memberNames);
    const memberIds = await Promise.all(
      memberNames.map(async (name) => {
        const user = await userdb.findOne({ name });
        if (user) {
          return user._id;
        } else {
          return res.status(400).json({ msg: "userNotFound" });
        }
      })
    );
    const newGroup = new groupdb({
      name,
      members: [...memberIds, createdBy],
      bio,
      groupIcon,
      createdBy,
      messageIds: [],
    });
    await newGroup.save();
    newGroup.members.forEach(async (member) => {
      const user = await userdb.findOne({ _id: member });
      if (user) {
        user.groups.push(newGroup._id);
        await user.save();
      }
    });
    res.status(200).json({ newGroup });
    if (io) {
      io.emit("newGroupCreated", {
        id: newGroup._id,
        members: newGroup.members,
      });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

groupRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const group = await groupdb.findById(id);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }
  res.json(group);
});

groupRouter.post("/all", async (req, res) => {
  const { ids } = req.body as { ids: string[] };
  const groups = await groupdb.find({ _id: { $in: ids } });
  res.json(groups);
});

groupRouter.get("/:id/members", async (req, res) => {
  const { id } = req.params;
  const group = await groupdb.findById(id);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }
  const members = await userdb.find({ _id: { $in: group.members } });
  const memberObj = members.map((member) => {
    return {
      name: member.name,
      profile: member.profile,
    };
  });
  res.json(memberObj);
});

groupRouter.post("/addNewMember", async (req, res) => {
  const io: Server | undefined = req.io;
  const { id, name } = req.body as { id: string; name: string };
  if (!id || !name) {
    return res.status(400).json({ msg: "missingFields" });
  }
  const [user, group] = await Promise.all([
    userdb.findOne({ name }),
    groupdb.findById(id),
  ]);
  if (!user || !group) {
    return res.status(404).json({ msg: "Not Found" });
  }
  if (group.members.includes(user._id)) {
    return res.status(400).json({ msg: "Already a member" });
  }
  group.members.push(user._id);
  await group.save();
  user.groups.push(group._id);
  await user.save();
  if (io) {
    io.emit("newMember", {
      userId: user._id,
      group,
    });
  }
  res.status(200).json({ msg: "ok" });
});

groupRouter.post("/removeMember", async (req, res) => {
  const io: Server | undefined = req.io;
  const { id, name, userId } = req.body as {
    id: string;
    name: string;
    userId: string;
  };
  if (!name) {
    return res.status(400).json({ msg: "name is missing" });
  }
  if (!id) {
    return res.status(400).json({ msg: "id is missing" });
  }
  if (!userId) {
    return res.status(400).json({ msg: "userId is missing" });
  }
  const [userToBeRem, group, user] = await Promise.all([
    userdb.findOne({ name }),
    groupdb.findById(id),
    userdb.findById(userId),
  ]);
  if (!group) {
    return res.status(404).json({ msg: "Group Not Found" });
  }
  if (!userToBeRem) {
    return res.status(404).json({ msg: "User Not Found" });
  }
  if (!user) {
    return res.status(404).json({ msg: "User Not Found" });
  }
  if (!(group.createdBy?.toString() === user._id.toString())) {
    return res
      .status(400)
      .json({ msg: "Only group creator can remove members" });
  }
  if (user._id.toString() === userToBeRem._id.toString()) {
    return res.status(400).json({ msg: "You cannot remove yourself" });
  }
  group.members = group.members.filter(
    (memberId) => memberId.toString() !== userToBeRem._id.toString()
  );
  await group.save();
  userToBeRem.groups = userToBeRem.groups.filter(
    (groupId) => groupId.toString() !== group._id.toString()
  );
  await userToBeRem.save();
  if (io) {
    io.to(id).emit("removeMember", {
      userId: userToBeRem._id,
    });
  }
  res.status(200).json({ msg: "ok" });
});

groupRouter.post("/exitGroup", async (req, res) => {
  const { groupId, userId } = req.body as {
    groupId: string;
    userId: string;
  };
  if (!groupId) {
    return res.status(400).json({ msg: "groupId is missing" });
  }
  if (!userId) {
    return res.status(400).json({ msg: "userId is missing" });
  }
  const [user, group] = await Promise.all([
    userdb.findById(userId),
    groupdb.findById(groupId),
  ]);
  if (!user) {
    return res.status(404).json({ msg: "User Not Found" });
  }
  if (!group) {
    return res.status(404).json({ msg: "Group Not Found" });
  }
  user.groups = user.groups.filter(
    (groupId) => groupId.toString() !== group._id.toString()
  );
  await user.save();
  group.members = group.members.filter(
    (memberId) => memberId.toString() !== user._id.toString()
  );
  if (user._id.toString() === group.createdBy?.toString()) {
    group.createdBy = group.members[0];
  }
  await group.save();
  res.status(200).json({ msg: "ok" });
});

groupRouter.post("/changeName", async (req, res) => {
  const io: Server | undefined = req.io;
  const { groupId, name } = req.body as { groupId: string; name: string };
  if (!groupId) {
    return res.status(400).json({ msg: "groupId is missing" });
  }
  if (!name) {
    return res.status(400).json({ msg: "name is missing" });
  }
  const group = await groupdb.findById(groupId);
  if (!group) {
    return res.status(404).json({ msg: "Group Not Found" });
  }
  group.name = name;
  await group.save();
  if (io) {
    io.to(groupId).emit("nameChanged", {
      newName: name,
    });
  }
  res.status(200).json({ msg: "ok" });
});

groupRouter.post("/changeBio", async (req, res) => {
  const io: Server | undefined = req.io;
  const { groupId, bio } = req.body as { groupId: string; bio: string };
  if (!groupId) {
    return res.status(400).json({ msg: "groupId is missing" });
  }
  if (!bio) {
    return res.status(400).json({ msg: "bio is missing" });
  }
  const group = await groupdb.findById(groupId);
  if (!group) {
    return res.status(404).json({ msg: "Group Not Found" });
  }
  group.bio = bio;
  await group.save();
  if (io) {
    io.to(groupId).emit("bioChanged", {
      newBio: bio,
    });
  }
  res.status(200).json({ msg: "ok" });
});

groupRouter.post("/changeProfile", async (req, res) => {
  const io: Server | undefined = req.io;
  const { groupId, imgURL } = req.body as { groupId: string; imgURL: string };
  if (!groupId) {
    return res.status(400).json({ msg: "groupId is missing" });
  }
  if (!imgURL) {
    return res.status(400).json({ msg: "imgURL is missing" });
  }
  const group = await groupdb.findById(groupId);
  if (!group) {
    return res.status(404).json({ msg: "Group Not Found" });
  }
  group.groupIcon = imgURL;
  await group.save();
  if (io) {
    io.to(groupId).emit("profileChanged", {
      newProfile: imgURL,
    });
  }
  res.status(200).json({ msg: "ok" });
});

groupRouter.post("/clear", async (req, res) => {
  const { groupId } = req.body as { groupId: string };
  if (!groupId) {
    return res.status(400).json({ msg: "groupId is missing" });
  }
  const group = await groupdb.findById(groupId);
  if (!group) {
    return res.status(404).json({ msg: "Group Not Found" });
  }
  const messageIds = group.messageIds;
  await Promise.all(messageIds.map((id) => messagedb.findByIdAndDelete(id)));
  group.messageIds = [];
  await group.save();
  res.status(200).json({ msg: "ok" });
});

groupRouter.post("/delete", async (req, res) => {
  const io: Server | undefined = req.io;
  const { groupId } = req.body as { groupId: string };
  if (!groupId) {
    return res.status(400).json({ msg: "groupId is missing" });
  }
  const group = await groupdb.findByIdAndDelete(groupId);
  const memberIds = group?.members;
  const users = await userdb.find({ _id: { $in: memberIds } });
  users.forEach((user) => {
    user.groups = user.groups.filter(
      (groupId) => groupId.toString() !== group?._id.toString()
    );
    user.save();
  });
  if (!group) {
    return res.status(404).json({ msg: "Group Not Found" });
  }
  const newmemberIds = group.members.filter(
    (id) => id.toString() !== group.createdBy?.toString()
  );
  if (io) {
    io.emit("deleted", {
      groupId: group._id,
      members: newmemberIds,
    });
  }
  res.status(200).json({ msg: "ok" });
});

export default groupRouter;
