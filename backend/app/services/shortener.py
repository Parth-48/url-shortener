import hashlib
import string
import random

CHARACTERS = string.digits + string.ascii_lowercase + string.ascii_uppercase

# 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ

BASE = len(CHARACTERS) #62 Base62

def encode_base62(num: int) -> str:
    
    if num == 0:
        return CHARACTERS[0]

    result = []
    while num > 0:
        remainder = num % BASE
        result.append(CHARACTERS[remainder])
        num = num // BASE

    return ''.join(reversed(result))

def generate_short_code(url: str, length: int=8) -> str:
    # MD5 hash of URL
    hash_value = hashlib.md5(url.encode()).hexdigest()

    num = int(hash_value[:16], 16)
    code = encode_base62(num)[:length]

    return code

def generate_random_code(length: int=8) -> str:

    return ''.join(random.choices(CHARACTERS, k=length))



"""

URL → MD5 Hash → Integer → Base62 → Short Code

"youtube.com/..." 
→ "d41d8cd98f00b204..."  (MD5)
→ 15248458463821940736  (integer)
→ "aX9kP2mQ"            (Base62, first 8 chars)

"""
