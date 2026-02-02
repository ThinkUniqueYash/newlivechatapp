import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function App() {
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("chat:history", (history) => {
      setMessages(history);
    });

    socket.on("chat:message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat:history");
      socket.off("chat:message");
    };
  }, []);

  const joinChat = () => {
    if (name.trim().length < 2) return;
    setJoined(true);
  };

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("chat:message", {
      user: name,
      text,
    });

    setText("");
  };

  if (!joined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md w-80">
          <h1 className="text-3xl font-bold text-center text-indigo-600">
            Join Chat
          </h1>

          <input
            className="w-full mt-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            onClick={joinChat}
          >
            Join
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-md p-4">
        <h2 className="text-xl font-semibold text-center text-indigo-600">
          Real-time Chat App
        </h2>

        <div className="mt-4 h-96 overflow-y-auto border rounded-lg p-3 space-y-3">
          {messages.map((m) => (
            <div key={m.id}>
              <span className="font-semibold text-indigo-600">{m.user}</span>
              <div className="bg-gray-100 rounded-lg px-3 py-2 mt-1 inline-block">
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-indigo-600 text-white px-4 rounded-lg hover:bg-indigo-700 transition"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
