import { Route, Routes, useLocation } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Navbar from "./components/layouts/Navbar";
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Group = lazy(() => import("./pages/Group"));
const User = lazy(() => import("./pages/User"));
const Enroll = lazy(() => import("./pages/Enroll"));
const Auction = lazy(() => import("./pages/Auction"));
const Payment = lazy(() => import("./pages/Payment"));
const WeekGroup = lazy(() => import("./pages/WeekGroup"));
const Agent = lazy(() => import("./pages/Agent"));
const Daybook = lazy(() => import("./pages/Daybook"));
const Test = lazy(() => import("./pages/Test"));
const Lead = lazy(() => import("./pages/Lead"));
const LeadSetting = lazy(() => import("./pages/LeadSetting"));
const Receipt = lazy(() => import("./pages/Receipt"));
const GroupReport = lazy(() => import("./pages/GroupReport"));
const UserReport = lazy(() => import("./pages/UserReport"));
const Profile = lazy(() => import("./pages/Profile"));
const AuctionReport = lazy(() => import("./pages/AuctionReport"));
const Print = lazy(() => import("./pages/Print"));
const AppSettings = lazy(() => import("./pages/AppSettings"));
const GroupSettings = lazy(() => import("./pages/GroupSettings"));
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import CircularLoader from "./components/loaders/CircularLoader";
function App() {
  const location = useLocation();
  return (
    <>
      <div className="overflow-x-hidden">
        <Suspense fallback={<CircularLoader seconds={30} />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Navbar />
                </ProtectedRoute>
              }
            />

            <Route
              path="/group"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Group />
                </ProtectedRoute>
              }
            />
            <Route
              path="/week-group"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <WeekGroup />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <User />
                </ProtectedRoute>
              }
            />
            <Route
              path="/enrollment"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Enroll />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auction"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Auction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Agent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daybook"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Daybook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lead"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Lead />
                </ProtectedRoute>
              }
            />

            <Route
              path="/"
              element={
                <>
                  <Login />
                </>
              }
            />
            <Route
              path="/lead-setting"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <LeadSetting />
                </ProtectedRoute>
              }
            >
              <Route
                path="app-settings"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <AppSettings />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="groups"
                  element={
                    <ProtectedRoute>
                      <Navbar />
                      <GroupSettings />
                    </ProtectedRoute>
                  }
                />
                <Route />
              </Route>
            </Route>
            <Route
              path="/receipt"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Receipt />
                </ProtectedRoute>
              }
            />
            <Route
              path="/group-report"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <GroupReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-report"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <UserReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auction-report"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <AuctionReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/print/:id"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Print />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Test />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default App;
