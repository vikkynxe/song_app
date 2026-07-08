import requests
import re

def debug_wikipedia_connection(search_query):
    print(f"--- Testing Connection for: '{search_query}' ---\n")
    
    api_url = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "format": "json",
        "titles": search_query,
        "prop": "extracts",
        "exintro": True,
        "explaintext": True
    }
    
    # MAGIC FIX: We are changing the User-Agent to look exactly like Google Chrome on a Windows PC.
    # This usually bypasses strict anti-bot filters.
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        # Send the request
        response = requests.get(api_url, params=params, headers=headers, timeout=10)
        
        print(f"HTTP Status Code: {response.status_code}")
        
        # If the status code is not 200 (OK), something is blocking it at the network level
        if response.status_code != 200:
            print("WARNING: Wikipedia did not return a 200 OK status.")
        
        # Try to parse JSON. If it fails, we will catch it and print the RAW text!
        try:
            data = response.json()
            
            # If we get here, it worked!
            pages = data.get("query", {}).get("pages", {})
            for page_id, page_info in pages.items():
                if page_id == "-1":
                    print("Result: Page not found on Wikipedia.")
                else:
                    extract_text = page_info.get("extract", "")
                    print("\nSUCCESS! Data retrieved. Extracting date...")
                    
                    # Regex pattern to find the release date or year
                    # Matches formats like "6 January 2017", "January 6, 2017", or just a 4 digit year
                    date_pattern = r"released (?:on |in )?([A-Z][a-z]+ \d{1,2}, \d{4}|\d{1,2} [A-Z][a-z]+ \d{4}|\d{4})"
                    match = re.search(date_pattern, extract_text)
                    
                    if match:
                        print(f"--> Extracted Release Date/Year: {match.group(1)}")
                    else:
                        print("--> Could not find a specific release date in the text.")
                        print(f"    Sample text: {extract_text[:200]}...")
                    
        except requests.exceptions.JSONDecodeError:
            print("\n❌ CRASH AVERTED: Wikipedia did NOT return JSON.")
            print("Here is the raw text they sent back instead (first 500 characters):")
            print("-" * 40)
            # This will show us if it's an HTML error page, a firewall login screen, etc.
            print(response.text[:500])
            print("-" * 40)

    except requests.exceptions.RequestException as e:
        print(f"❌ NETWORK ERROR: Could not connect to Wikipedia at all.\nDetails: {e}")

# Run the test
debug_wikipedia_connection("raasathi unna ")
