import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/log_in";
import MusicPlayer from "./pages/MusicPlayer";
import CreateAccount from "./pages/CreateAccount";


function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/create_account"
          element={<CreateAccount />}
        />
        <Route
          path="/MusicPlayer"
          element={
            isLoggedIn === ("true" || '' || null) ? <MusicPlayer /> : <Navigate to="/" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
