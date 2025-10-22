# QKD Secure Chat 🔒✨

**QKD Secure Chat** is a modern web application demonstrating **Quantum Key Distribution (QKD) principles** in real-time messaging. Built with **React**, **TailwindCSS**, and **Framer Motion**, the app features interactive animations, real-time chat readiness, and a visually engaging interface for secure communication.

---

## 🚀 Features

- **Quantum-secured messaging:** Messages are encrypted using simulated QKD keys.  
- **Live connection status:** Shows if the quantum link between Alice and Bob is active.  
- **Interactive QKD Visualizer:** Animates qubits and the key exchange process.  
- **Modern UI/UX:** Smooth animations, gradient headers, interactive buttons, and responsive design.  
- **WebSocket-ready ChatBox:** Ready for real-time messaging integration.  

---

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS, Framer Motion  
- **Icons:** Lucide-react  
- **Animations:** Framer Motion  
- **Styling:** TailwindCSS (gradients, shadows, responsive design)  
- **Realtime Simulation:** WebSocket-ready (requires backend integration)  
- **Quantum Simulation:** Simulated QKD key generation  

---

## 📁 Project Structure

frontend/
├── src/
│ ├── App.jsx
│ ├── index.css
│ ├── QuantumVisualizer.jsx
│ └── components/
│ ├── Header.jsx
│ ├── ChatBox.jsx
│ └── Footer.jsx
├── package.json
└── vite.config.js

yaml
Copy code

---

## 🎨 Screenshots

![Header](screenshots/header.png)  
![ChatBox](screenshots/chatbox.png)  
![QKD Visualizer](screenshots/visualizer.png)  

---

## 💻 Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/YOUR_USERNAME/QKD-ChatApp.git
cd QKD-ChatApp/frontend
Install dependencies:

bash
Copy code
npm install
Run the development server:

bash
Copy code
npm run dev
Open http://localhost:5173 in your browser.

🔧 Notes
Ensure Node.js >= 18 is installed.

Dependencies include react, tailwindcss, framer-motion, and lucide-react.

ChatBox is ready for WebSocket integration to enable real-time messaging.

📖 Future Enhancements
Full real-time chat integration with backend.

Optional real quantum random number generator for keys.

Dark/light theme toggle.

Mobile-first UI refinements.

More interactive visualizations (multi-qubit, eavesdropper simulation).

📝 License
This project is open-source under the MIT License.
