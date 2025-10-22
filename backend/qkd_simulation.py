# qkd_simulation.py
import random
import hashlib
from typing import List

def generate_qkd_key(length: int = 64) -> bytes:
    """
    Simulate a BB84-like QKD process and return a 32-byte key (SHA-256).
    length = number of qubits / bit positions to simulate (raw).
    """
    print("⚙️ Starting BB84 QKD simulation...")

    # Alice bits & bases
    alice_bits: List[int] = [random.randint(0, 1) for _ in range(length)]
    alice_bases: List[str] = [random.choice(['+', 'x']) for _ in range(length)]

    # Bob chooses bases and measures
    bob_bases: List[str] = [random.choice(['+', 'x']) for _ in range(length)]
    bob_results: List[int] = []
    for i in range(length):
        if alice_bases[i] == bob_bases[i]:
            bob_results.append(alice_bits[i])
        else:
            bob_results.append(random.randint(0, 1))

    # Sift: keep bits where bases matched
    matching_indices = [i for i in range(length) if alice_bases[i] == bob_bases[i]]
    shared_bits = [alice_bits[i] for i in matching_indices]

    # Convert bits -> string -> hash to derive 32-byte key
    bitstring = ''.join(map(str, shared_bits))
    key = hashlib.sha256(bitstring.encode()).digest()

    print(f"🔑 QKD key generated ({len(shared_bits)} raw bits -> 256-bit key)")
    return key
