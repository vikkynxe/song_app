import pandas as pd

# 1. Configuration - Set your inputs here
INPUT_FILE = "/home/vikky/Desktop/Song_downloading_application/dbs/original/spotify_tracks.csv"       # The source file you want to read
OUTPUT_FILE = "filtered_output.csv"      # The new file where matching rows will be saved
TARGET_COLUMN = "language"                     # Replace with your actual column name
SEARCH_WORD = "Tamil"                      # Replace with the word you want to find

print(f"Reading data from {INPUT_FILE}...")

try:
    # 2. Read the entire CSV file
    df = pd.read_csv(INPUT_FILE)
    
    # 3. Filter the rows
    # str.contains() searches for the substring. 
    # case=False makes it case-insensitive (matches YYY, yyy, Yyy).
    # na=False ensures it ignores blank/empty rows without crashing.
    filtered_df = df[df[TARGET_COLUMN].str.contains(SEARCH_WORD, case=False, na=False)]
    
    # 4. Save matching rows to a new CSV file
    filtered_df.to_csv(OUTPUT_FILE, index=False, encoding='utf-8')
    
    print("\n🚀 Filtering complete!")
    print(f"Total rows scanned: {len(df)}")
    print(f"Rows matching '{SEARCH_WORD}' in column '{TARGET_COLUMN}': {len(filtered_df)}")
    print(f"Saved matching data to '{OUTPUT_FILE}'")

except FileNotFoundError:
    print(f"\n❌ Error: The file '{INPUT_FILE}' was not found. Check your file path.")
except KeyError:
    print(f"\n❌ Error: The column '{TARGET_COLUMN}' does not exist in your CSV file.")
    print(f"Available columns are: {list(df.columns)}")
except Exception as e:
    print(f"\n❌ An unexpected error occurred: {e}")

