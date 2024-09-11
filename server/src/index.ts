import express, { Express, Request, Response, NextFunction } from "express";
import loginRouter from "./routes/auth/login";
import registerRouter from "./routes/auth/register";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createServer } from "http";
import groupRouter from "./routes/groups/newGroup";
import userRouter from "./routes/user/user";

declare global {
  namespace Express {
    interface Request {
      io?: Server;
    }
  }
}

dotenv.config();
const DB_URL = process.env.DATABASE_URL;

const app: Express = express();
const PORT = 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [],
    credentials: true,
  },
});

const ioMiddleware = (io: Server) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.io = io;
    next();
  };
};

app.use(ioMiddleware(io));

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join", (groupId) => {
    socket.join(groupId);
  });

  socket.on("leave", (groupId) => {
    socket.leave(groupId);
  });
});

app.use("/auth/login", loginRouter);
app.use("/auth/register", registerRouter);
app.use("/user", userRouter);

app.use("/group", groupRouter);

if (!DB_URL) {
  console.log("DATABASE_URL is not defined");
  process.exit(1);
}
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

server.listen(PORT, () => {
  console.log(`Nakama server listening at http://localhost:${PORT}`);
});
