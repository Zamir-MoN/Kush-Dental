import re

def normalize_phone(phone: str) -> str:
    """
    Normalizes a phone number to a canonical format:
    - Retains a leading '+' if present.
    - Strips all other non-digit characters.
    """
    if not phone:
        return ""
    
    # Check for leading +
    has_plus = phone.strip().startswith('+')
    
    # Remove all non-digits
    digits_only = re.sub(r'\D', '', phone)
    
    if has_plus and digits_only:
        return f"+{digits_only}"
    return digits_only
