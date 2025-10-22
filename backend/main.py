# main.py
import os
import logging
from typing import Dict

import socketio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from qkd_simulation import generate_qkd_key
from pqcrypto_utils import generate_kyber_keypair, derive_hybrid_key
from crypto_utils import encrypt_message, decrypt_message

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("quantumshield")

# Socket.IO + FastAPI
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
asgi_app = socketio.ASGIApp(sio, other_asgi_app=app)

# In-memory store for demo
SHARED_KEYS: Dict[str, bytes] = {}
SESSIONS: Dict[str, Dict] = {}

@app.get("/")
async def root():
    return {"status": "QuantumShield backend running"}

@app.post("/generate_keys")
async def generate_keys(room: str = "default", qkd_qubits: int = 512):
    """
    Generate QKD + PQC hybrid key for a room and store it in memory.
    (Demo only: returns hex for testing.)
    """
    logger.info("Generating keys for room=%s qkd_qubits=%d", room, qkd_qubits)
    # Use smaller length arg for the qkd module; keep it reasonable
    qkd_len = max(32, qkd_qubits // 8)
    qkd_key = generate_qkd_key(length=qkd_len)

    try:
        public_key, secret_key = generate_kyber_keypair()
    except Exception as exc:
        logger.exception("PQC generation failed: %s", exc)
        raise HTTPException(status_code=500, detail="PQC generation failed")

    hybrid = derive_hybrid_key(qkd_key, public_key, secret_key)
    SHARED_KEYS[room] = hybrid
    return {"room": room, "hybrid_key_hex": hybrid.hex(), "note": "Do not expose keys in production"}

@app.get("/key/{room}")
async def get_key(room: str):
    if room not in SHARED_KEYS:
        raise HTTPException(status_code=404, detail="Key not found")
    return {"room": room, "hybrid_key_hex": SHARED_KEYS[room].hex()}

@app.post("/encrypt")
async def server_encrypt(payload: Dict):
    room = payload.get("room", "default")
    message = payload.get("message", "")
    if not message:
        raise HTTPException(status_code=400, detail="Missing message")
    if room not in SHARED_KEYS:
        raise HTTPException(status_code=404, detail="Key not ready")
    ct = encrypt_message(message, SHARED_KEYS[room])
    return {"room": room, "ciphertext": ct}

@app.post("/decrypt")
async def server_decrypt(payload: Dict):
    room = payload.get("room", "default")
    ciphertext = payload.get("ciphertext", "")
    if not ciphertext:
        raise HTTPException(status_code=400, detail="Missing ciphertext")
    if room not in SHARED_KEYS:
        raise HTTPException(status_code=404, detail="Key not ready")
    try:
        pt = decrypt_message(ciphertext, SHARED_KEYS[room])
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Decryption failed: {exc}")
    return {"room": room, "plaintext": pt}

# Socket.IO events
@sio.event
async def connect(sid, environ):
    logger.info("Client connected: %s", sid)

@sio.event
async def disconnect(sid):
    logger.info("Client disconnected: %s", sid)
    if sid in SESSIONS:
        del SESSIONS[sid]

@sio.event
async def join(sid, data):
    room = data.get("room", "default")
    username = data.get("username", "anon")
    await sio.save_session(sid, {"room": room, "username": username})
    await sio.enter_room(sid, room)
    SESSIONS[sid] = {"room": room, "username": username}
    logger.info("SID %s joined room %s as %s", sid, room, username)
    await sio.emit("user_joined", {"sid": sid, "username": username}, room=room)

@sio.event
async def send_encrypted(sid, data):
    room = data.get("room", "default")
    sender = data.get("sender", "anon")
    ciphertext = data.get("ciphertext")
    if not ciphertext:
        await sio.emit("error", {"msg": "No ciphertext provided"}, to=sid)
        return
    logger.info("Broadcasting encrypted message from %s in room %s", sender, room)
    await sio.emit("receive_encrypted", {
        "room": room,
        "sender": sender,
        "ciphertext": ciphertext
    }, room=room)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    import uvicorn
    uvicorn.run("main:asgi_app", host="0.0.0.0", port=port, reload=True)
