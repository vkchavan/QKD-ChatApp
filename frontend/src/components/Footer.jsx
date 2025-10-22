// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-4 text-center mt-6 border-t border-gray-700">
      <p className="text-sm">
        © {new Date().getFullYear()} Quantum Chat — Secured by Quantum Key Distribution 🔐
      </p>
    </footer>
  );
};

export default Footer;
