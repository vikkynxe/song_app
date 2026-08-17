import React, { useState } from 'react';

const PlaylistUploadForm = () => {
  const [playlistName, setPlaylistName] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv' || file.name.endsWith('.csv')) {
      setCsvFile(file);
    } else {
      alert('Please upload a valid CSV file.');
      e.target.value = null; // Reset the input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!playlistName || !csvFile) {
      alert("Please provide both a playlist name and a CSV file.");
      return;
    }

    setIsSubmitting(true);

    // FormData is required when uploading files via an API
    const formData = new FormData();
    formData.append('playlistname', playlistName);
    formData.append('file', csvFile);
    formData.append('hash_id', localStorage.getItem("token"));

    try {
      // Example API call (replace with your actual backend endpoint)
      
      const response = await fetch('http://localhost:8000/api/create_playlist/', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        alert("Playlist uploaded successfully!");
      }
      
      
      console.log("Ready to send:", {
        playlistName: formData.get('playlistName'),
        file: formData.get('file').name
      });
      
      alert(`Successfully processed "${playlistName}" with file: ${csvFile.name}`);
      
      // Reset form after successful submission
      setPlaylistName('');
      setCsvFile(null);
      e.target.reset(); // Resets the file input UI
      
    } catch (error) {
      console.error("Error uploading form:", error);
      alert("An error occurred during upload.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Basic inline styles for a clean, modern look (dark mode inspired)
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '40px auto',
      padding: '24px',
      backgroundColor: '#181818',
      borderRadius: '8px',
      color: '#fff',
      fontFamily: 'sans-serif',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
    },
    formGroup: {
      marginBottom: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#a7a7a7'
    },
    input: {
      padding: '10px 12px',
      borderRadius: '4px',
      border: '1px solid #333',
      backgroundColor: '#282828',
      color: '#fff',
      fontSize: '16px',
      outline: 'none'
    },
    fileInput: {
      padding: '8px 0',
      color: '#a7a7a7',
      fontSize: '14px'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#1db954', // Spotify Green
      color: '#000',
      border: 'none',
      borderRadius: '24px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
      opacity: isSubmitting ? 0.7 : 1,
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Import Playlist</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="playlistName" style={styles.label}>
            Playlist Name
          </label>
          <input
            id="playlistName"
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="e.g., Summer Road Trip"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="csvUpload" style={styles.label}>
            Upload Tracklist (CSV)
          </label>
          <input
            id="csvUpload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={styles.fileInput}
            required
          />
        </div>

        <button 
          type="submit" 
          style={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Uploading...' : 'Create Playlist'}
        </button>
      </form>
    </div>
  );
};

export default PlaylistUploadForm;
