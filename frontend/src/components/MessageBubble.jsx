import React from "react";
import { motion } from "framer-motion";

export default function MessageBubble({ msg }) {
  const isUser = msg.sender === "You";

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`max-w-xs px-4 py-3 rounded-2xl text-sm shadow-md ${
          isUser
            ? "bg-cyan-600 text-white rounded-br-none"
            : "bg-gray-700 text-gray-100 rounded-bl-none"
        }`}
      >
        {msg.text}
      </div>
    </motion.div>
  );
}
