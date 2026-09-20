import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/log_in";
import HomePage from "./pages/HomePage";
import CreateAccount from "./pages/CreateAccount";
import AudioPlayer from "./pages/MusicPlayerFromapp";

function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create_account" element={<CreateAccount />} />
        <Route path="/HomePage" element={ isLoggedIn === ("true") ? <HomePage /> : <Navigate to="/" /> } />
        <Route path="/AudioPlayer" element={<AudioPlayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
