import json

# Configuration
INPUT_FILE = "summa.txt"      # Text file containing JSON
OUTPUT_FILE = "output.json"   # Output file
KEY_TO_REMOVE = "automatic_captions"         # Change this to the key you want to remove


def remove_key(data, key):
    """Recursively remove a key from dictionaries and lists."""
    if isinstance(data, dict):
        data.pop(key, None)  # Remove the key if it exists
        for value in data.values():
            remove_key(value, key)
    elif isinstance(data, list):
        for item in data:
            remove_key(item, key)


def main():
    # Read JSON from the text file
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Remove the specified key
    remove_key(data, KEY_TO_REMOVE)

    # Save the modified JSON
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print(f"Removed key '{KEY_TO_REMOVE}' and saved to '{OUTPUT_FILE}'.")


if __name__ == "__main__":
    main()
