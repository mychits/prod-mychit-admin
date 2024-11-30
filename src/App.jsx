import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/layouts/Navbar";
import Login from "./pages/Login";
import Group from "./pages/Group";
import User from "./pages/User";
import Enroll from "./pages/Enroll";
import Auction from "./pages/Auction";
import Payment from "./pages/Payment";

function App() {
  const location = useLocation();

  return (
    <div className="overflow-x-hidden">
      {location.pathname !== "/" && <Navbar />}
      <Routes>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/group" element={<Group />} />
        <Route path="/user" element={<User />} />
        <Route path="/enrollment" element={<Enroll />} />
        <Route path="/auction" element={<Auction />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
