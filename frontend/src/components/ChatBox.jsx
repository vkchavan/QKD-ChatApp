import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ socket }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("chat_message", (data) => {
      setChat((prev) => [...prev, data]);
    });
    return () => socket.off("chat_message");
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat_message", { text: message, sender: "You" });
      setChat((prev) => [...prev, { text: message, sender: "You" }]);
      setMessage("");
    }
  };

  return (
    <motion.div
      className="w-full max-w-2xl bg-gray-800/60 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-lg p-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="h-96 overflow-y-auto rounded-xl p-4 space-y-2">
        {chat.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-3 mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type an encrypted message..."
          className="flex-1 p-3 rounded-xl bg-gray-700/60 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-xl text-white font-semibold transition-all"
        >
          Send
        </button>
      </form>
    </motion.div>
  );
}
