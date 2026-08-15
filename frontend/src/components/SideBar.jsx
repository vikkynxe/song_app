import { useState } from "react";


function SideBarF({ setPage }) {

  return (
  
    <aside className="sidebar">
      
      <div className="logo">
        <i className="fa-brands fa-spotify"></i> Streamify
      </div>

      <ul className="nav-links">
        <li>
          <a href="#" className="active" onClick={() => setPage("home")}>
            <i className="fa-solid fa-house"></i> Home
          </a>
        </li>

        <li>
          <a href="#" onClick={() => setPage("search")}>
            <i className="fa-solid fa-magnifying-glass"></i> Search
          </a>
        </li>

        <li>
          <a href="#" onClick={() => setPage("yourlibrary")}>
            <i className="fa-solid fa-book"></i> Your Library
          </a>
        </li>
      </ul>

      <ul className="nav-links">
        <li>
          <a href="#" onClick={() => setPage("createplaylist")}>
            <i className="fa-solid fa-square-plus"></i> Create Playlist
          </a>
        </li>

        <li>
          <a href="#" onClick={() => setPage("likedsongs")}>
            <i
              className="fa-solid fa-heart"
              style={{
                background: "linear-gradient(135deg, #450af5, #c4efd9)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            ></i>{" "}
            Liked Songs
          </a>
        </li>
      </ul>

      <div onClick={() => setPage("playlist")} className="playlists-header">Your Playlists</div>

    </aside>
  );
}

export default SideBarF;
