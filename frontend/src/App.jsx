import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/log_in";
import MusicPlayer from "./pages/MusicPlayer";
import HomePage from "./pages/HomePage";
import CreateAccount from "./pages/CreateAccount";
import BottomPlayerF from "./components/BottomPlayer";


function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create_account" element={<CreateAccount />} />
        <Route path="/MusicPlayer" element={ isLoggedIn === ("true") ? <MusicPlayer /> : <Navigate to="/" /> } />
        <Route path="/HomePage" element={ isLoggedIn === ("true") ? <HomePage /> : <Navigate to="/" /> } />
        <Route path="/BottomPlayerF" element={<BottomPlayerF />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
