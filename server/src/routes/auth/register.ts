import express from "express";
import userdb from "../../models/User";

const registerRouter = express.Router();

registerRouter.use(express.json());

registerRouter.get("/", (req, res) => {
  res.json({ msg: "this is register route" });
});

registerRouter.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ msg: "missingFields" });
  }
  const [user1, user2] = await Promise.all([
    userdb.findOne({ name: username }),
    userdb.findOne({ email: email }),
  ]);
  const isExistingUser = user1 || user2;
  if (isExistingUser) {
    if (isExistingUser.name === username) {
      return res.status(400).json({ msg: "usernme already in use" });
    }
    return res.status(400).json({ msg: "email already in use" });
  }
  const newUser = new userdb({
    name: username,
    email,
    password,
  });
  newUser.save();
  res.status(200).json({ msg: "ok" });
});

export default registerRouter;
