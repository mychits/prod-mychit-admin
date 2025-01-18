import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/layouts/Navbar";
import Login from "./pages/Login";
import Group from "./pages/Group";
import User from "./pages/User";
import Enroll from "./pages/Enroll";
import Auction from "./pages/Auction";
import Payment from "./pages/Payment";
import WeekGroup from "./pages/WeekGroup";
import Agent from "./pages/Agent";
import Daybook from "./pages/Daybook";
import Test from "./pages/Test";
import Lead from "./pages/Lead";
import LeadSetting from "./pages/LeadSetting";
import Receipt from "./pages/Receipt";
import GroupReport from "./pages/GroupReport";
import UserReport from "./pages/UserReport";
import Profile from "./pages/Profile";
import AuctionReport from "./pages/AuctionReport";

function App() {
  const location = useLocation();

  return (
    <div className="overflow-x-hidden">
      {location.pathname !== "/" && <Navbar />}
      <Routes>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/group" element={<Group />} />
        <Route path="/week-group" element={<WeekGroup />} />
        <Route path="/user" element={<User />} />
        <Route path="/enrollment" element={<Enroll />} />
        <Route path="/auction" element={<Auction />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/agent" element={<Agent />} />
        <Route path="/daybook" element={<Daybook />} />
        <Route path="/lead" element={<Lead />} />
        <Route path="/" element={<Login />} />
        <Route path="/lead-setting" element={<LeadSetting />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/group-report" element={<GroupReport />} />
        <Route path="/user-report" element={<UserReport />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auction-report" element={<AuctionReport />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </div>
  );
}

export default App;
