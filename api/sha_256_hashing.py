import hashlib

text = "Song name - Artist"

def hashing_sha_256(data):

    hash_id = hashlib.sha256(data.encode("utf-8")).hexdigest()
    
    return (hash_id)

if (__name__ == "__main__"):
    print(hashing_sha_256(text))
