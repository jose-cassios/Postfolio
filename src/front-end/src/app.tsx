import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProfileProvider } from "./components/profile/ProfileContext";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage"
import Competition from "./pages/CompetitionPage";
import UserProfile from "./pages/UserProfilePage";
import MessagesPage from "./pages/MessagesPage";
import AboutUsPage from "./pages/AboutUsPage";
import RegisterPage from "./pages/RegisterPage";

export function App() {
  return (
    <ProfileProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/competicao" element={<Competition />} />
          <Route path="/login" element={<Login />}></Route>
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
    </Router>
    </ProfileProvider>
    
  );
}
