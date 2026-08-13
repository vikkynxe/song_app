function bottom_player_f(){
  return(
    <div class="player">
            <div class="now-playing">
                <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&q=80" alt="Album Art" />
                <div class="track-info">
                    <h4>Midnight City</h4>
                    <p>M83</p>
                </div>
                <i class="fa-regular fa-heart"></i>
            </div>

            <div class="player-controls">
                <div class="buttons">
                    <i class="fa-solid fa-shuffle"></i>
                    <i class="fa-solid fa-backward-step"></i>
                    <i class="fa-solid fa-circle-play"></i>
                    <i class="fa-solid fa-forward-step"></i>
                    <i class="fa-solid fa-repeat"></i>
                </div>
                <div class="progress-bar">
                    <span>1:34</span>
                    <div class="progress">
                        <div class="progress-filled"></div>
                    </div>
                    <span>4:03</span>
                </div>
            </div>

            <div class="volume-controls">
                <i class="fa-solid fa-microphone"></i>
                <i class="fa-solid fa-list"></i>
                <i class="fa-solid fa-computer"></i>
                <i class="fa-solid fa-volume-high"></i>
                <div class="volume-bar">
                    <div class="volume-filled"></div>
                </div>
            </div>
    </div>
    );
  }
export default bottom_player_f;
