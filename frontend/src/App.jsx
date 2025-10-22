import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Header from "./components/Header";
import ChatBox from "./components/ChatBox";
import Footer from "./components/Footer";

const socket = io("http://localhost:8000"); // Your backend URL

export default function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-6">
      <Header connected={connected} />
      <ChatBox socket={socket} />
      <Footer />
    </div>
  );
}
