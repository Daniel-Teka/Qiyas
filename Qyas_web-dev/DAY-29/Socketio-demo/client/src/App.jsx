// React Hooks እና የ socket.io-client ላይብረሪን ማስገባት
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// ከጀርባ (Backend) ሰርቨር ጋር መገናኛ አድራሻ መወሰን
const socket = io("http://localhost:5000");

function App() {
  // የሚጻፈውን መልዕክት በስቴት (State) ለመያዝ
  const [message, setMessage] = useState("");
  // የመጡትን ሁሉንም መልዕክቶች በሊስት (Array) መልክ ለመያዝ
  const [chat, setChat] = useState([]);

  // ሰርቨሩ መልዕክት ሲልክ ለመቀበል የሚያዳምጥ (Listen የሚያደርግ) ሁክ
  useEffect(() => {
    // ከሰርቨሩ "receive_message" የሚል መልዕክት ሲመጣ መቀበል
    socket.on("receive_message", (data) => {
      // የመጣውን አዲስ መልዕክት ከነባሮቹ መልዕክቶች ጋር አብሮ መጨመር
      setChat((prev) => [...prev, data]);
    });

    // ኮምፖነንቱ ሲዘጋ (Unmount ሲሆን) ማዳመጡን ማቆም
    return () => socket.off("receive_message");
  }, []);

  // መልዕክት ወደ ሰርቨሩ ለመላክ የሚያገለግል ፈንክሽን
  const sendMessage = () => {
    // የተጻፈው መልዕክት ባዶ ከሆነ ምንም አያደርግም (ስፔስ ብቻ ከሆነም አይልከውም)
    if (!message.trim()) return;

    // "send_message" በሚል ርዕስ መልዕክቱን ወደ ሰርቨሩ መላክ
    socket.emit("send_message", message);
    // መልዕክቱ ከተላከ በኋላ መጻፊያ ሳጥኑን ባዶ ማድረግ
    setMessage("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>⚡ Socket.IO Vite Chat</h2>

      {/* የጽሑፍ መጻፊያ ሳጥን (Input Box) */}
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />

      {/* መልዕክቱን ለመላክ የሚጫን ቁልፍ (Button) */}
      <button onClick={sendMessage}>Send</button>

      <hr />

      <h3>Messages</h3>

      {/* የገቡትን መልዕክቶች በሙሉ በስክሪኑ ላይ ማሳያ */}
      {chat.map((msg, index) => (
        <p key={index}>💬 {msg}</p>
      ))}
    </div>
  );
}

export default App;

// // የሚያስፈልጉትን የReact ሁኮች (Hooks) እና የSocket.io ላይብረሪን ማስገባት
// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// // ከጀርባ ከሚሰራው (Backend) ሰርቨር ጋር ግንኙነት መፍጠር
// // ማሳሰቢያ፡ ፖርት 5000 የሰርቨራችን አድራሻ ነው
// const socket = io("http://localhost:5000");

// function App() {
//   // message: ተጠቃሚው አሁን በመጻፍ ላይ ያለውን ነጠላ መልዕክት ለመያዝ
//   const [message, setMessage] = useState("");
//   // chat: ከዚህ በፊት የመጡ እና የተላኩ መልዕክቶችን በሙሉ በሊስት (Array) መልክ ለመያዝ
//   const [chat, setChat] = useState([]);
//   // isTyping: ሌላ ሰው እየጻፈ መሆን አለመሆኑን ለማወቅ (እውነት/ሐሰት)
//   const [isTyping, setIsTyping] = useState(false);

//   // ገጹ መጀመሪያ ሲከፈት የኔትወርክ ግንኙነቶችን ለመከታተል የሚሰራ ሁክ (useEffect)
//   useEffect(() => {
//     // ከሰርቨሩ አዲስ መልዕክት ("receive_message") ሲመጣ መቀበል
//     socket.on("receive_message", (data) => {
//       // አዲሱን መልዕክት ከቀደሙት መልዕክቶች ጋር አብሮ በሊስቱ ውስጥ መጨመር
//       setChat((prev) => [...prev, data]);
//     });

//     // ሌላ ሰው እየጻፈ ነው የሚል መረጃ ("user_typing") ሲመጣ ማሳያውን ማብራት
//     socket.on("user_typing", () => {
//       setIsTyping(true);
//     });

//     // ሌላኛው ሰው መጻፍ አቁሟል የሚል መረጃ ("user_stop_typing") ሲመጣ ማሳያውን ማጥፋት
//     socket.on("user_stop_typing", () => {
//       setIsTyping(false);
//     });

//     // ተጠቃሚው ገጹን ሲዘጋው ኔትወርኩን ማቋረጥ (Memory leak እንዳይኖር)
//     return () => {
//       socket.off("receive_message");
//       socket.off("user_typing");
//       socket.off("user_stop_typing");
//     };
//   }, []);

//   // ተጠቃሚው በሳጥኑ ውስጥ ጽሑፍ ሲጽፍ የሚቀሰቀስ ፈንክሽን
//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setMessage(value); // የጻፈውን ጽሑፍ በስቴት ውስጥ መመዝገብ

//     // በሳጥኑ ውስጥ ጽሑፍ ካለ "እየጻፍኩ ነው" ብሎ ለሌላው ሰው ያሳውቃል
//     if (value.trim().length > 0) {
//       socket.emit("typing");
//     } else {
//       // ሳጥኑ ባዶ ከሆነ "መጻፍ አቁሜያለሁ" ብሎ ያሳውቃል
//       socket.emit("stop_typing");
//     }
//   };

//   // የላክ (Send) ቁልፍ ሲጫን መልዕክቱን የሚልክ ፈንክሽን
//   const sendMessage = () => {
//     // የተጻፈው ጽሑፍ ባዶ ከሆነ ምንም ነገር እንዳይልክ መከልከል
//     if (!message.trim()) return;

//     // "send_message" በሚል ርዕስ ጽሑፉን ወደ ሰርቨሩ መላክ
//     socket.emit("send_message", message);
    
//     // መልዕክቱ ስለተላከ መጻፍ አቁሜያለሁ የሚል ምልክት መላክ
//     socket.emit("stop_typing");
    
//     // የጽሑፍ መጻፊያ ሳጥኑን መልሶ ባዶ ማድረግ
//     setMessage("");
//   };

//   return (
//     <div style={{ padding: 20, fontFamily: "sans-serif" }}>
//       <h2>⚡ Socket.IO Vite Chat</h2>

//       {/* የጽሑፍ መጻፊያ ሳጥን */}
//       <input
//         value={message}
//         onChange={handleInputChange}
//         placeholder="Type message..."
//         style={{ padding: 8, marginRight: 5 }}
//       />

//       {/* መልዕክት መላኪያ ቁልፍ */}
//       <button onClick={sendMessage} style={{ padding: 8 }}>Send</button>

//       {/* ሌላ ሰው እየጻፈ ከሆነ ብቻ ይህ የጽሑፍ ምልክት በስክሪኑ ላይ ይታያል */}
//       {isTyping && <p style={{ fontStyle: "italic", color: "gray" }}>✍️ Someone is typing...</p>}

//       <hr />

//       <h3>Messages</h3>
//       {/* በሊስት ውስጥ የተከማቹትን መልዕክቶች በሙሉ አንድ በአንድ አውጥቶ ማሳየት */}
//       {chat.map((msg, index) => (
//         <p key={index} style={{ background: "#f1f1f1", padding: 8, borderRadius: 5 }}>
//           💬 {msg}
//         </p>
//       ))}
//     </div>
//   );
// }

// export default App;
