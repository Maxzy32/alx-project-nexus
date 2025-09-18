// // src/pages/VotingHistoryPage.jsx
// import React, { useEffect, useState } from "react";


// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// import {
//   fetchUserVoteHistory,
//   fetchPollResults,
// } from "../ApiCalls/api";

// const VotingHistoryPage = () => {
//   const [history, setHistory] = useState([]);
//   const [selectedPoll, setSelectedPoll] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   // Load voting history
//   useEffect(() => {
//     const loadHistory = async () => {
//       try {
//         const response = await fetchUserVoteHistory();
//         setHistory(response.data);
//       } catch (err) {
//         console.error("Failed to load vote history:", err);
//       }
//     };
//     loadHistory();
//   }, []);

//   // View poll results
//   const viewPollResults = async (pollId) => {
//     try {
//       const response = await fetchPollResults(pollId);
//       setSelectedPoll(response.data);
//       setIsDialogOpen(true);
//     } catch (err) {
//       console.error("Failed to load poll results:", err);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold mb-4">My Voting History</h1>

//       {history.length === 0 ? (
//         <p className="text-gray-500">You haven’t voted in any polls yet.</p>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {history.map((vote) => (
//             <Card key={vote.vote_id} className="shadow-md">
//               <CardHeader>
//                 <CardTitle>{vote.poll_title}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-gray-600 mb-2">
//                   You voted for:{" "}
//                   <span className="font-semibold text-blue-600">
//                     {vote.option_text || vote.candidate_name}
//                   </span>
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   Voted on: {new Date(vote.voted_at).toLocaleString()}
//                 </p>
//                 <Button
//                   className="mt-3"
//                   onClick={() => viewPollResults(vote.poll_id)}
//                 >
//                   View Full Results
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Results Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="max-w-2xl">
//           {selectedPoll && (
//             <>
//               <DialogHeader>
//                 <DialogTitle>{selectedPoll.title} - Results</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-6">
//                 <p className="text-sm text-gray-700">
//                   Total Votes:{" "}
//                   <span className="font-semibold">
//                     {selectedPoll.total_votes}
//                   </span>
//                 </p>

//                 {/* Options Results */}
//                 {selectedPoll.options.length > 0 && (
//                   <>
//                     <h2 className="font-semibold">Options</h2>
//                     <ResponsiveContainer width="100%" height={250}>
//                       <BarChart data={selectedPoll.options}>
//                         <XAxis dataKey="option_text" />
//                         <YAxis />
//                         <Tooltip />
//                         <Bar dataKey="votes" fill="#2563eb" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </>
//                 )}

//                 {/* Candidates Results */}
//                 {selectedPoll.candidates.length > 0 && (
//                   <>
//                     <h2 className="font-semibold">Candidates</h2>
//                     <ResponsiveContainer width="100%" height={250}>
//                       <BarChart data={selectedPoll.candidates}>
//                         <XAxis dataKey="full_name" />
//                         <YAxis />
//                         <Tooltip />
//                         <Bar dataKey="votes" fill="#16a34a" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </>
//                 )}
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default VotingHistoryPage;

// src/pages/VotingHistoryPage.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Modal,
  Row,
  Col,
  Navbar,
  Container,
  Nav,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { fetchUserVoteHistory, fetchPollResults } from "../ApiCalls/api";


const VotingHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load voting history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetchUserVoteHistory();
        setHistory(response.data);
      } catch (err) {
        console.error("Failed to load vote history:", err);
      }
    };
    loadHistory();
  }, []);

  // View poll results
  const viewPollResults = async (pollId) => {
    try {
      const response = await fetchPollResults(pollId);
      setSelectedPoll(response.data);
      setIsDialogOpen(true);
    } catch (err) {
      console.error("Failed to load poll results:", err);
    }
  };

  return (
<>
    
<Navbar bg="primary" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="#">⚡ Nesux Polls</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Polls</Nav.Link>
             <Nav.Link as={Link} to="/results">Results</Nav.Link>
              <Nav.Link href="#profile">Profile</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    <div className="p-4">
      <h1 className="mb-4">My Voting History</h1>

      {history.length === 0 ? (
        <p className="text-muted">You haven’t voted in any polls yet.</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {history.map((vote) => (
            <Col key={vote.vote_id}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{vote.poll_title}</Card.Title>
                  <Card.Text>
                    <strong>You voted for:</strong>{" "}
                    <span className="text-primary">
                      {vote.option_text || vote.candidate_name}
                    </span>
                  </Card.Text>
                  <Card.Text className="text-muted" style={{ fontSize: "0.9rem" }}>
                    Voted on: {new Date(vote.voted_at).toLocaleString()}
                  </Card.Text>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => viewPollResults(vote.poll_id)}
                  >
                    View Full Results
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Results Modal */}
      <Modal
        show={isDialogOpen}
        onHide={() => setIsDialogOpen(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPoll ? `${selectedPoll.title} - Results` : "Results"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPoll && (
            <>
              <p>
                <strong>Total Votes:</strong> {selectedPoll.total_votes}
              </p>

              {/* Options Results */}
              {selectedPoll.options.length > 0 && (
                <>
                  <h5>Options</h5>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={selectedPoll.options}>
                      <XAxis dataKey="option_text" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="votes" fill="#0d6efd" />
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}

              {/* Candidates Results */}
              {selectedPoll.candidates.length > 0 && (
                <>
                  <h5 className="mt-4">Candidates</h5>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={selectedPoll.candidates}>
                      <XAxis dataKey="full_name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="votes" fill="#198754" />
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
    </>
  );
};

export default VotingHistoryPage;
