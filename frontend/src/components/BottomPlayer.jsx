import { useEffect } from "react";

function BottomPlayerF() {
  useEffect(() => {
    async function getSong() {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8000/api/songs/${token}`
      );

      const data = await response.json();

      console.log(data);
    }

    getSong();
  }, []);

  
  return(
    <div className="player">
            <div className="now-playing">
                <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&q=80" alt="Album Art" />
                <div className="track-info">
                    <h4>Midnight City</h4>
                    <p>M83</p>
                </div>
                <i className="fa-regular fa-heart"></i>
            </div>

            <div className="player-controls">
                <div className="buttons">
                    <i className="fa-solid fa-shuffle"></i>
                    <i className="fa-solid fa-backward-step"></i>
                    <i className="fa-solid fa-circle-play"></i>
                    <i className="fa-solid fa-forward-step"></i>
                    <i className="fa-solid fa-repeat"></i>
                </div>
                <div className="progress-bar">
                    <span>1:34</span>
                    <div className="progress">
                        <div className="progress-filled"></div>
                    </div>
                    <span>4:03</span>
                </div>
            </div>

            <div className="volume-controls">
                <i className="fa-solid fa-microphone"></i>
                <i className="fa-solid fa-list"></i>
                <i className="fa-solid fa-computer"></i>
                <i className="fa-solid fa-volume-high"></i>
                <div className="volume-bar">
                    <div className="volume-filled"></div>
                </div>
            </div>
    </div>
    );
  }
export default BottomPlayerF;
