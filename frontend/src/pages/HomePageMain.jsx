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
                    <img src="https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&q=80" alt="Jazz" />
                    <div className="play-btn"><i className="fa-solid fa-play"></i></div>
                    <h4>Late Night Jazz</h4>
                    <p>Smooth saxophone and piano rhythms.</p>
                </div>
            </div>

        </>

);
}
export default HomePageMain;