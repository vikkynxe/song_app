import { useState } from "react";
import SideBarF from "../components/SideBar.jsx";
import "../Style/HomePage.css"
import PlaylistUploadForm from "../pages/CreatePlaylistPage.jsx"
import HomePageMain from "./HomePageMain.jsx";
import PlaylistDashboard from "../pages/ListPlaylist.jsx"

function HomePage() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ display: "flex" }}>
      <div className="app-container">
        <SideBarF setPage={setPage}/>

        {page === "home" && (
          <HomePageMain />
        )}
      

        {page === "search" && (
          <div>
            <h1>Music</h1>
            <p>Here is your music.</p>
          </div>
        )}

        {page === "yourlibrary" && (
          <PlaylistDashboard />
        )}

        {page === "createplaylist" && (
          <PlaylistUploadForm />
        )}
      
        {page === "likedsongs" && (
          <div>
            <h1>likedplaylist</h1>
            <p>Here are your artists.</p>
          </div>
        )}
        </div>
      </div>
  );
}

export default HomePage;
