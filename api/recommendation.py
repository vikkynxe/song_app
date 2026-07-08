import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

# 1. Load your dataset
df = pd.read_csv('/home/vikky/Desktop/song_app/dbs/filtered_output.csv')

# 2. Select the numerical features for audio profiling
# We exclude track_id, track_name, artwork_url, track_url, language, etc.
feature_cols = [
    'acousticness', 'danceability', 'energy', 'instrumentalness', 
    'key', 'liveness', 'loudness', 'mode', 'speechiness', 
    'tempo', 'time_signature', 'valence', 'popularity'
]

# 3. Normalize the features (e.g., bringing tempo and loudness to a 0-1 scale)
scaler = MinMaxScaler()
df_normalized = pd.DataFrame(scaler.fit_transform(df[feature_cols]), columns=feature_cols)

# 4. Compute the Similarity Matrix
# This calculates how similar every song is to every other song
similarity_matrix = cosine_similarity(df_normalized)

# 5. Recommendation Function
def recommend_songs(song_title, num_recommendations=5):
    # Find the index of the song the user likes
    try:
        song_idx = df[df['track_name'].str.lower() == song_title.lower()].index[0]
    except IndexError:
        return f"Song '{song_title}' not found in the dataset."
    
    # Get similarity scores for this song against all others
    similarity_scores = list(enumerate(similarity_matrix[song_idx]))
    
    # Sort songs based on highest similarity score (excluding itself)
    sorted_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)[1:num_recommendations+1]
    
    # Fetch song metadata for the recommendations
    recommendations = []
    for idx, score in sorted_scores:
        recommendations.append({
            'Song': df.iloc[idx]['track_name'],
            'Artist': df.iloc[idx]['artist_name'],
            'Year': df.iloc[idx]['year'],
            'Album': df.iloc[idx]['album_name'],
            'Match Score': round(score * 100, 2)
        })

    return recommendations

# --- Example Usage ---
# Pass a song name that exists in your dataset
recommend_songs("sodakku", num_recommendations=5)

