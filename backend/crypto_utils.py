# crypto_utils.py
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os
import base64
from typing import Tuple

def key_to_aes_key(key32: bytes) -> bytes:
    """
    Accepts a 32-byte input (sha256) and returns a 32-byte AES key (AES-256).
    """
    if len(key32) == 32:
        return key32
    import hashlib
    return hashlib.sha256(key32).digest()

def encrypt_message(message: str, key: bytes) -> str:
    """
    Encrypt plaintext string with AES-GCM. Returns base64 of (nonce + ciphertext).
    """
    aes_key = key_to_aes_key(key)
    aesgcm = AESGCM(aes_key)
    nonce = os.urandom(12)
    ct = aesgcm.encrypt(nonce, message.encode("utf-8"), associated_data=None)
    payload = nonce + ct
    return base64.b64encode(payload).decode()

def decrypt_message(ciphertext_b64: str, key: bytes) -> str:
    """
    Decrypt base64(nonce + ciphertext) using AES-GCM and return plaintext string.
    """
    aes_key = key_to_aes_key(key)
    data = base64.b64decode(ciphertext_b64)
    nonce = data[:12]
    ct = data[12:]
    aesgcm = AESGCM(aes_key)
    pt = aesgcm.decrypt(nonce, ct, associated_data=None)
    return pt.decode("utf-8")
