import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login"
import Competition from "./pages/Competition";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/competicao" element={<Competition />} />
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </Router>
  );
}
