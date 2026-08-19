function PlaylistSongsFun({selectedPlaylist}){

    async function get_songs_from_db() {
        try {
          const response = await fetch("http://localhost:8000/api/get_songs/", {
            method: "POST",
            body: JSON.stringify({
              token: selectedPlaylist?.id
            })
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
      
          const result = await response.json();
          console.log(result);
        } catch (error) {
          console.error("Request failed:", error);
        }
      }
      
      get_songs_from_db();


    return (
    <div>
        <h1>nothing is here to see</h1>
        <p>{selectedPlaylist?.id}</p>
        <p>{selectedPlaylist?.name}</p>
    </div>
    );
}
export default PlaylistSongsFun;