import bodyParser from "body-parser";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

app.use(bodyParser.json());

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on("connection", (socket) => {
  console.log("a user connected");


  socket.on("room:join", (data) => {
    const { room, name, email } = data;
    emailToSocketMapping.set(email, socket.id);
    socketToEmailMapping.set(socket.id, email);
    console.log({ emailToSocketMapping });

    socket.join(room);

    socket.emit("room:joined", {room});

    socket.broadcast
      .to(room)
      .emit("user:joined", {room, name, email});
  });

  socket.on("user:call", (data) => {
    const { email, offer } = data;
    const CallFromEmail = socketToEmailMapping.get(socket.id);
    const CallToSocketId = emailToSocketMapping.get(email);
    io.to(CallToSocketId).emit("user:incoming", { offer,CallFromEmail });
  });


  socket.on("user:answer", (data) => {
    const CallFromEmail = socketToEmailMapping.get(socket.id);
    const SocketId = emailToSocketMapping.get(data.CallFromEmail);
    io.to(SocketId).emit("user:answer", { answer: data.answer });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

httpServer.listen(8000);
