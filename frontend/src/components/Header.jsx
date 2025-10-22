import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Wifi, KeyRound } from "lucide-react";
import QuantumVisualizer from "../QuantumVisualizer";

export default function Header({ connected }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.header
        className="relative flex items-center justify-between w-full max-w-3xl 
                   bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 
                   backdrop-blur-md rounded-2xl shadow-2xl px-8 py-5 mb-8 border border-gray-700/70 overflow-hidden"
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* 🔹 Background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-transparent to-purple-600/10 blur-3xl"
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />

        {/* 🛡️ Logo + Title */}
        <div className="flex items-center gap-3 relative z-10">
          <ShieldCheck className="text-cyan-400 drop-shadow-lg" size={32} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              QKD Secure Chat
            </h1>
            <p className="text-sm text-gray-400 -mt-1">
              Quantum Key Distribution Powered
            </p>
          </div>
        </div>

        {/* 📶 Connection Status + Visualizer Button */}
        <div className="flex items-center gap-5 relative z-10">
          {/* Connection status */}
          <motion.div
            className="flex items-center gap-2"
            animate={{
              opacity: connected ? [0.7, 1, 0.7] : 1,
              scale: connected ? [1, 1.05, 1] : 1,
            }}
            transition={{
              repeat: connected ? Infinity : 0,
              duration: 1.5,
            }}
          >
            <Wifi
              size={22}
              className={`${
                connected ? "text-green-400" : "text-red-400"
              } drop-shadow-md`}
            />
            <span
              className={`text-sm ${
                connected ? "text-green-300" : "text-red-300"
              }`}
            >
              {connected ? "Quantum Link Active" : "Disconnected"}
            </span>
          </motion.div>

          {/* Quantum Visualizer button */}
          <motion.button
            onClick={() => setOpen(true)}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-full bg-gradient-to-tr from-cyan-700 to-blue-600 
                       hover:from-cyan-500 hover:to-blue-400 transition-all 
                       shadow-lg shadow-cyan-800/30 border border-cyan-500/30"
            title="Visualize QKD Process"
          >
            <KeyRound className="text-white drop-shadow-sm" size={22} />
          </motion.button>
        </div>
      </motion.header>

      <QuantumVisualizer open={open} setOpen={setOpen} />
    </>
  );
}
