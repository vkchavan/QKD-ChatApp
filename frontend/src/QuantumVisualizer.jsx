import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { motion } from "framer-motion";
import { KeyRound, Shield, Lock } from "lucide-react";

export default function QuantumVisualizer({ open, setOpen }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("Initializing quantum channel...");
  const [keyBits, setKeyBits] = useState("");
  const [encrypted, setEncrypted] = useState(false);

  useEffect(() => {
    if (open) {
      setProgress(0);
      setPhase("Initializing quantum channel...");
      setKeyBits("");
      setEncrypted(false);

      const stages = [
        "Generating random quantum bits (qubits)...",
        "Transmitting photons securely...",
        "Detecting and filtering eavesdropping...",
        "Deriving shared secret key...",
        "Encrypting communication channel..."
      ];

      let i = 0;
      const interval = setInterval(() => {
        if (i < stages.length) {
          setPhase(stages[i]);
          setProgress(((i + 1) / stages.length) * 100);

          // Random bit generation
          if (i === 0 || i === 3) {
            const randomBits = Array.from({ length: 32 }, () =>
              Math.random() > 0.5 ? "1" : "0"
            ).join("");
            setKeyBits(randomBits);
          }

          i++;
        } else {
          clearInterval(interval);
          setEncrypted(true);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [open]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-gray-900 border border-cyan-700/50 p-6 shadow-2xl text-gray-100">
              <Dialog.Title className="flex items-center gap-2 text-xl font-semibold text-cyan-400">
                <KeyRound size={22} /> Quantum Key Distribution
              </Dialog.Title>

              <p className="mt-2 text-sm text-gray-300">{phase}</p>

              <div className="mt-5 w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="bg-cyan-500 h-2.5 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Glowing binary key bits */}
              <div className="mt-6 font-mono text-sm text-center text-cyan-400 tracking-widest">
                {keyBits.split("").map((bit, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      opacity: [0.6, 1, 0.6],
                      y: [0, -1, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.02,
                    }}
                    className={bit === "1" ? "text-cyan-300" : "text-cyan-600"}
                  >
                    {bit}
                  </motion.span>
                ))}
              </div>

              {/* Lock animation when encrypted */}
              {encrypted && (
                <motion.div
                  className="mt-8 flex flex-col items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    className="p-4 bg-cyan-500/20 rounded-full border border-cyan-500"
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      repeat: 2,
                      duration: 0.6,
                    }}
                  >
                    <Lock size={40} className="text-cyan-400" />
                  </motion.div>
                  <p className="text-cyan-300 font-semibold text-sm">
                    Channel Securely Encrypted 🔐
                  </p>
                </motion.div>
              )}

              <div className="mt-6 flex justify-center gap-3">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                    animate={{
                      y: [0, -5, 0],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setOpen(false)}
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-all font-semibold"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 flex justify-center text-xs text-gray-500">
                <Shield size={14} className="mr-1" /> QKD ensures quantum-secure
                encryption — eavesdropping instantly alters qubits.
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
