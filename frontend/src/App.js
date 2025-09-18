// import React, { useState, useEffect } from "react";
// import LoginPage from "./components/LoginPage";
// import PollsPage from "./components/PollsPage";
// import VotingHistoryPage from "./components/VotingHistoryPage";
// import { Spinner } from "react-bootstrap";

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // NEW

//   // Load user from localStorage on mount
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//     setLoading(false); // Finished checking
//   }, []);

//   // Save user to localStorage whenever it changes
//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//     } else {
//       localStorage.removeItem("user");
//     }
//   }, [user]);

//   if (loading) {
//     return (
//       <div className="d-flex align-items-center justify-content-center vh-100">
//         <Spinner animation="border" role="status" variant="primary">
//           <span className="visually-hidden">Loading...</span>
//         </Spinner>
//       </div>
//     );
//   }

//   return !user ? (
//     <LoginPage setUser={setUser} />
//   ) : (
//     <PollsPage user={user} setUser={setUser} />
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import PollsPage from "./components/PollsPage";
import VotingHistoryPage from "./components/VotingHistoryPage";
import { Spinner } from "react-bootstrap";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

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

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
