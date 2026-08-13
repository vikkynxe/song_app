function side_bar_f(){
  return(
        <aside className="sidebar">
            <div className="logo">
                <i className="fa-brands fa-spotify"></i> Streamify
            </div>
            
            <ul className="nav-links">
                <li><a href="#" className="active"><i className="fa-solid fa-house"></i> Home</a></li>
                <li><a href="#"><i className="fa-solid fa-magnifying-glass"></i> Search</a></li>
                <li><a href="#"><i className="fa-solid fa-book"></i> Your Library</a></li>
            </ul>
            
            <ul className="nav-links">
                <li><a href="#"><i className="fa-solid fa-square-plus"></i> Create Playlist</a></li>
                <li><a href="#"><i className="fa-solid fa-heart" style="background: linear-gradient(135deg, #450af5, #c4efd9); -webkit-background-clip: text; color: transparent;"></i> Liked Songs</a></li>
            </ul>

            <div className="playlists-header">Your Playlists</div>
            <ul className="nav-links" style="overflow-y: auto; flex: 1;">
                <li><a href="#">Chill Vibes 2024</a></li>
                <li><a href="#">Deep Focus</a></li>
                <li><a href="#">Workout Mix</a></li>
                <li><a href="#">Late Night Drive</a></li>
                <li><a href="#">Acoustic Covers</a></li>
            </ul>
        </aside>
);
}
export default side_bar_f;
