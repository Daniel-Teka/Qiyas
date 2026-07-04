import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Connect to backend server
const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Listen for incoming messages from other users
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    // Listen for typing events
    socket.on("user_typing", () => setIsTyping(true));
    socket.on("user_stop_typing", () => setIsTyping(false));

    // Cleanup listeners on unmount
    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (value.trim().length > 0) {
      socket.emit("typing");
    } else {
      socket.emit("stop_typing");
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    // 1. Send message to the backend server
    socket.emit("send_message", message);
    
    // 2. IMMEDIATELY add your own message to your local screen
    setChat((prev) => [...prev, `You: ${message}`]);

    // 3. Reset typing state and empty the input box
    socket.emit("stop_typing");
    setMessage("");
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>⚡ Socket.IO Vite Chat</h2>

      <input
        value={message}
        onChange={handleInputChange}
        placeholder="Type message..."
        style={{ padding: 8, marginRight: 5 }}
      />
      <button onClick={sendMessage} style={{ padding: 8 }}>Send</button>

      {isTyping && <p style={{ fontStyle: "italic", color: "gray" }}>✍️ Someone is typing...</p>}

      <hr />

      <h3>Messages</h3>
      {chat.map((msg, index) => (
        <p key={index} style={{ background: "#f1f1f1", padding: 8, borderRadius: 5 }}>
          💬 {msg}
        </p>
      ))}
    </div>
  );
}

export default App;
