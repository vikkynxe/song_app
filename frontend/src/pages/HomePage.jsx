import { useState } from "react";
import SideBarF from "../components/SideBar.jsx";
import BottomPlayerF from "../components/BottomPlayer"
import "../Style/HomePage.css"

function HomePage() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ display: "flex" }}>
      <SideBarF setPage={setPage}/>

      <main>
        {page === "home" && (
          <div>
            <h1>Home</h1>
            <p>Welcome to the home page.</p>
          </div>
        )}

        {page === "search" && (
          <div>
            <h1>Music</h1>
            <p>Here is your music.</p>
          </div>
        )}

        {page === "yourlibrary" && (
          <div>
            <h1>Albums</h1>
            <p>Here are your albums.</p>
          </div>
        )}

        {page === "createplaylist" && (
          <div>
            <h1>createplaylist</h1>
            <p>Here are your artists.</p>
          </div>
        )}
      
        {page === "likedsongs" && (
          <div>
            <h1>likedplaylist</h1>
            <p>Here are your artists.</p>
          </div>
        )}
        
        {page === "playlist" && (
          <div>
            <h1>yourplaylist</h1>
            <p>Here are your artists.</p>
          </div>
        )}      
      </main>
      
      
      <BottomPlayerF />
    </div>
  );
}

export default HomePage;
