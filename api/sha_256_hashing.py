import hashlib
import base64

text = "409114e2f2c7e0683d2cd16e1ac820dcc90a24d81ae49c9dc564a7bb3f41768dliked_playlist"

def hashing_sha_256(data):
    hash_id = hashlib.sha256(data.encode("utf-8")).hexdigest()
    return (hash_id)


def md5_hashing(text):
    text = text.encode('utf-8')
    raw_bytes = hashlib.md5(text).digest()

    b64_hash = base64.urlsafe_b64encode(raw_bytes).decode('utf-8').rstrip("=")

    print(b64_hash)
    return b64_hash

if (__name__ == "__main__"):
    print(hashing_sha_256(text))
    print(md5_hashing(text))
    
    
