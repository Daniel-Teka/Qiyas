// ለሰርቨር ስራ የሚያስፈልጉ ላይብረሪዎችን ማስገባት
const express = require("express");
const http = require("http");
const { Server } = require("socket.io"); // 'Server' በትልቅ ፊደል መሆን አለበት
const cors = require("cors");

// የ express አፕሊኬሽን መፍጠር
const app = express();

// የ cors መከላከያን መፍቀድ
app.use(cors());

// በብሮውዘር http://localhost:5000/ ሲከፈት "cannot get /" እንዳይል
app.get("/", (req, res) => {
  res.send("ሰርቨሩ በትክክል እየሰራ ነው! (socket.io server is running)");
});

// የ http ሰርቨር መፍጠር
const server = http.createServer(app); // 'createServer' መሆን አለበት ('s' በትልቅ ፊደል)

// የኢንተርኔት መገናኛ (socket.io) ሰርቨር መፍጠር እና ማስተካከል
const io = new Server(server, { // 'Server' በትልቅ ፊደል
  cors: {
    // የ vite ፍሮንትኤንድ ፖርት (5173) እንዲገናኝ መፍቀድ
    origin: "http://localhost:5173",
    methods: ["GET", "POST"], // 'GET' እና 'POST' በትላልቅ ፊደላት ቢሆኑ ይመረጣል
  },
});

// አዲስ ተጠቃሚ በኔትወርክ ሲገናኝ የሚሠራ ክፍል
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // ከአንድ ተጠቃሚ መልዕክት ሲመጣ
  socket.on("send_message", (data) => {
    console.log(data);
    io.emit("receive_message", data);
  });

  // አንድ ተጠቃሚ እየጻፈ መሆኑን ሲያሳውቅ
  socket.on("typing", () => {
    socket.broadcast.emit("user_typing");
  });

  // ተጠቃሚው መጻፍ ማቆሙን ሲያሳውቅ
  socket.on("stop_typing", () => {
    socket.broadcast.emit("user_stop_typing");
  });

  // ተጠቃሚው ሲወጣ
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ሰርቨሩን በፖርት ቁጥር 5000 ላይ ማስጀመር
server.listen(5000, () => {
  console.log("Server running on port 5000");
});
