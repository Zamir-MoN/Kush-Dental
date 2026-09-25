def get_password_hash(password: str) -> str:
    # Phase 3: Implement Argon2id hashing
    return "dummy_hash"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Phase 3: Implement Argon2id verification
    return False

def create_access_token(subject: str) -> str:
    # Phase 3: Implement JWT creation
    return "dummy_token"

def create_refresh_token(subject: str) -> str:
    # Phase 3: Implement secure opaque token creation
    return "dummy_refresh_token"
