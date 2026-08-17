import { Fragment } from "react";
function HomePageMain() {
return(
        <>
            <header className="header">
                <div className="nav-arrows">
                    <i className="fa-solid fa-chevron-left"></i>
                    <i className="fa-solid fa-chevron-right"></i>
                </div>
                <button className="profile-btn">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" alt="Profile" />
                    <span>Alex</span>
                    <i className="fa-solid fa-caret-down"></i>
                </button>
            </header>

            <h2 className="section-title">Good Afternoon</h2>
            <div className="cards-grid">
                <div className="card">
                    <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80" alt="EDM" />
                    <div className="play-btn"><i className="fa-solid fa-play"></i></div>
                    <h4>Electronic Dance</h4>
                    <p>Martin Garrix, Kygo, Zedd and more</p>
                </div>
                <div className="card">
                    <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80" alt="Mic" />
                    <div className="play-btn"><i className="fa-solid fa-play"></i></div>
                    <h4>Today's Top Hits</h4>
                    <p>The hottest tracks right now.</p>
                </div>
                <div className="card">
                    <img src="https://images.unsplash.com/photo-1493225457124-a1a2a5f5646a?w=300&q=80" alt="Guitar" />
                    <div className="play-btn"><i className="fa-solid fa-play"></i></div>
                    <h4>Acoustic Mornings</h4>
                    <p>Start your day right with smooth acoustics.</p>
                </div>
                <div className="card">
                    <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80" alt="Concert" />
                    <div className="play-btn"><i className="fa-solid fa-play"></i></div>
                    <h4>Rock classNameics</h4>
                    <p>Legends that defined a generation.</p>
                </div>
                <div className="card">
                    <img src="https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&q=80" alt="Jazz" />
                    <div className="play-btn"><i className="fa-solid fa-play"></i></div>
                    <h4>Late Night Jazz</h4>
                    <p>Smooth saxophone and piano rhythms.</p>
                </div>
            </div>

            <h2 className="section-title">Made For You</h2>
            <div className="cards-grid">
                <div className="card">
                    <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80" alt="Mix 1" />
                    <div className="play-btn"><i className="fa-solid fa-play"></i></div>
                    <h4>Daily Mix 1</h4>
                    <p>Oasis, Blur, The Verve and more</p>
                </div>
                <div className="card">
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80" alt="Mix 2" />
                    <div className="play-btn"><i className="fa-solid fa-play"></i></div>
                    <h4>Daily Mix 2</h4>
                    <p>Lofi beats to relax and study to.</p>
                </div>
                <div className="card">
                    <img src="https://images.unsplash.com/photo-1516280440502-a292ce3b8791?w=300&q=80" alt="Mix 3" />
                    <div className="play-btn"><i className="fa-solid fa-play"></i></div>
                    <h4>Release Radar</h4>
                    <p>Catch up on the latest releases.</p>
                </div>
                <div className="card">
                    <img src="https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&q=80" alt="Mix 4" />
                    <div className="play-btn"><i className="fa-solid fa-play"></i></div>
                    <h4>Discover Weekly</h4>
                    <p>New music tailored for your taste.</p>
                </div>
            </div>
        </>

);
}
export default HomePageMain;