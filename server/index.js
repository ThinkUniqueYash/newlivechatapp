const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let messages = [];

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.emit("chat:history", messages);

  socket.on("chat:message", (data) => {
    const msg = {
      id: Date.now(),
      user: data.user,
      text: data.text,
    };

    messages.push(msg);
    io.emit("chat:message", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Server running ✅");
});
const PORT=process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log("🚀 Server started on http://localhost:3001");
});
