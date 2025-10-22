# pqcrypto_utils.py
import hashlib
import secrets

# Try to import pqcrypto Kyber KEM; fall back to simulation if unavailable.
try:
    from pqcrypto.kem.kyber512 import generate_keypair, encrypt, decrypt  # type: ignore
    PQ_AVAILABLE = True
except Exception:
    PQ_AVAILABLE = False

def generate_kyber_keypair():
    """
    Returns (public_key, secret_key). If pqcrypto available uses Kyber, else returns simulated keys.
    """
    if PQ_AVAILABLE:
        pk, sk = generate_keypair()
        print("🔐 Kyber keypair generated (real pqcrypto).")
        return pk, sk
    else:
        print("⚠️ pqcrypto not available — using simulated Kyber keypair.")
        return secrets.token_bytes(32), secrets.token_bytes(64)

def derive_hybrid_key(qkd_key: bytes, public_key: bytes, secret_key: bytes) -> bytes:
    """
    Combine QKD-derived key and a PQC shared secret (simulated if necessary) to produce a 32-byte hybrid key.
    """
    if PQ_AVAILABLE:
        # encapsulate -> decrypt -> get shared secret (demo: same side sim)
        ct, ss = encrypt(public_key)
        recovered = decrypt(ct, secret_key)
        pqc_ss = recovered
    else:
        # fallback: use secure random bytes as a simulated shared secret
        pqc_ss = secrets.token_bytes(32)

    combined = qkd_key + pqc_ss
    return hashlib.sha256(combined).digest()
