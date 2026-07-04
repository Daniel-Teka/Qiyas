// ለሰርቨር ስራ የሚያስፈልጉ ላይብረሪዎችን ማስገባት
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// የ Express አፕሊኬሽን መፍጠር
const app = express();

// የ CORS መከላከያን መፍቀድ
app.use(cors());

// የ HTTP ሰርቨር መፍጠር
const server = http.createServer(app);

// የኢንተርኔት መገናኛ (Socket.IO) ሰርቨር መፍጠር እና ማስተካከል
const io = new Server(server, {
  cors: {
    // *** ማስተካከያ ***: የ Vite ፍሮንትኤንድ ፖርት (5173) እንዲገናኝ መፍቀድ
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// አዲስ ተጠቃሚ በኔትወርክ ሲገናኝ የሚሠራ ክፍል
io.on("connection", (socket) => {
  // የተገናኘውን ተጠቃሚ መለያ ቁጥር (ID) በኮንሶል ላይ ማሳየት
  console.log("New user connected:", socket.id);

  // ከተጠቃሚው "send_message" በሚል ርዕስ መልዕክት ሲመጣ
  socket.on("send_message", (data) => {
    // የመጣውን መልዕክት በሰርቨሩ ተርሚናል ላይ ማሳየት
    console.log(data);

    // የመጣውን መልዕክት ለተገናኙ ተጠቃሚዎች በሙሉ መልሶ ማሰራጨት (Broadcast ማድረግ)
    io.emit("receive_message", data);
  });

  // ተጠቃሚው መስመር ሲያቋርጥ (ሲወጣ)
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ሰርቨሩን በፖርት ቁጥር 5000 ላይ ማስጀመር
server.listen(5000, () => {
  console.log("Server running on port 5000");
});

// // ለሰርቨር ስራ የሚያስፈልጉ ዋና ዋና ላይብረሪዎችን መጥራት
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// // የ Express አፕሊኬሽን መፍጠር
// const app = express();

// // የ CORS  (ከተለያዩ ፖርቶች የሚመጡ ጥያቄዎችን ለማስተናገድ)(መፍቀድ)
// app.use(cors());

// // የ HTTP ሰርቨር መፍጠር
// const server = http.createServer(app);

// // የ Socket.IO ሰርቨር መፍጠር እና ከቪት (Vite) ፍሮንትኤንድ ጋር ማገናኘት
// const io = new Server(server, {
//   cors: {
    
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

// // አዲስ ተጠቃሚ በዌብሳይቱ በኩል ኔትወርክ ሲያገናኝ የሚሠራ ክፍል
// io.on("connection", (socket) => {
//   // የተገናኘውን ተጠቃሚ ልዩ መለያ ቁጥር (Socket ID) በተርሚናል ላይ ማሳየት
//   console.log("New user connected:", socket.id);

//   // ከአንድ ተጠቃሚ መልዕክት ሲመጣ
//   socket.on("send_message", (data) => {
//     // የመጣውን መልዕክት ለሁሉም ተጠቃሚዎች (ለላኪውም ጭምር) መልሶ ማሰራጨት
//     io.emit("receive_message", data);
//   });

//   // አንድ ተጠቃሚ እየጻፈ መሆኑን ሲያሳውቅ
//   socket.on("typing", () => {
//     // ከላኪው ውጪ ላሉት ሌሎች ተጠቃሚዎች ብቻ "እየጻፈ ነው" ብሎ ማስተላለፍ (broadcast)
//     socket.broadcast.emit("user_typing");
//   });

//   // ተጠቃሚው መጻፍ ማቆሙን ሲያሳውቅ
//   socket.on("stop_typing", () => {
//     // ከላኪው ውጪ ላሉት ሌሎች ተጠቃሚዎች ብቻ ምልክቱ እንዲጠፋ መላክ
//     socket.broadcast.emit("user_stop_typing");
//   });

//   // ተጠቃሚው ብሮውዘሩን ሲዘጋ ወይም ኢንተርኔት ሲያቋርጥ
//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// // ሰርቨሩን በፖርት ቁጥር 5000 ላይ ዝግጁ ማድረግ (ማስጀመር)
// server.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
