import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import PollsPage from "./components/PollsPage";
import VotingHistoryPage from "./components/VotingHistoryPage";
import PollManager from "./components/PollsManager";
import UserManager from "./components/UserManager";
import VotingOutcomes from "./components/GeneralVotesHistory";
import { UserContext } from './components/UserContext';
import { Spinner } from "react-bootstrap";

function App() {
  
const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  // // Load user from localStorage on mount
  // useEffect(() => {
  //   const savedUser = localStorage.getItem("user");
  //   if (savedUser) {
  //     setUser(JSON.parse(savedUser));
  //   }
  //   setLoading(false);
  // }, []);

  // // Save user to localStorage whenever it changes
  // useEffect(() => {
  //   if (user) {
  //     localStorage.setItem("user", JSON.stringify(user));
  //   } else {
  //     localStorage.removeItem("user");
  //   }
  // }, [user]);


  useEffect(() => {
  const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
  const accessToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token");

  if (savedUser && accessToken && refreshToken) {
    setUser(JSON.parse(savedUser));
  } else {
    setUser(null); // not logged in
  }

  setLoading(false);
}, []);


  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Router>
      {!user ? (
        <LoginPage setUser={setUser} />
      ) : (
        <Routes>
          {/* Default home (polls) */}
          <Route path="/" element={<PollsPage user={user} setUser={setUser} />} />
          
          {/* Results / voting history */}
          <Route path="/results" element={<VotingHistoryPage />} />
           <Route path="/polls/adminmanager" element={<PollManager />} />
           <Route path="/users_manager" element={<UserManager />} />
           <Route path="/general_history" element={<VotingOutcomes />} />


          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
