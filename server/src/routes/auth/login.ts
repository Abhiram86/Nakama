import express from "express";
import userdb from "../../models/User";

const loginRouter = express.Router();

loginRouter.use(express.json());

loginRouter.get("/", (req, res) => {
  res.json({ msg: "this is login route" });
});

loginRouter.post("/", async (req, res) => {
  const { identifier, password } = req.body;
  console.log(identifier, password);
  if (!identifier || !password) {
    return res.status(400).json({ msg: "missingFields" });
  }
  // const user = await userdb.findOne({ name: identifier });
  let [user1, user2] = await Promise.all([
    userdb.findOne({ name: identifier }),
    userdb.findOne({ email: identifier }),
  ]);
  const user = user1 || user2;
  if (!user) {
    return res.status(400).json({ msg: "userNotFound" });
  }
  if (user.password !== password) {
    return res.status(400).json({ msg: "wrongPassword" });
  }
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    groups: user.groups,
    profile: user.profile,
  });
});

export default loginRouter;
