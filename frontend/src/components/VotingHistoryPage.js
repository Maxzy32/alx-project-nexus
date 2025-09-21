
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
  Badge,
  Tab,
  Tabs,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  fetchUserVoteHistory,
  fetchPollResults,
  connectToPollResults,
} from "../ApiCalls/api";
import AppNavbar from "./AppNavbar";

const generateColors = (count) =>
  Array.from({ length: count }, (_, i) => `hsl(${(i * 360) / count}, 70%, 50%)`);

const VotingHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      {/* <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="#">⚡ Nesux Polls</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Polls</Nav.Link>
              <Nav.Link as={Link} to="/results">Results</Nav.Link>
              <Nav.Link as={Link} to="/general_history">Votinng Outcomes</Nav.Link>
              
              <Nav.Link href="#profile">Profile</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar> */}
      <AppNavbar/>

      <Container className="py-4">
        <h1 className="mb-4 text-center">🗳️ My Voting History</h1>

        {history.length === 0 ? (
          <p className="text-muted text-center">
            You haven’t voted in any polls yet.
          </p>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {history.map((vote) => (
              <Col key={vote.vote_id}>
                <Card className="shadow-sm h-100 hover-shadow">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold">{vote.poll_title}</Card.Title>
                    <Card.Text className="text-truncate mb-2">
                      {vote.description || "No description available."}
                    </Card.Text>
                    <p className="mb-2">
                      <strong>Your Vote: </strong>
                      <Badge bg="info">
                        {vote.option_text || vote.candidate_name}
                      </Badge>
                    </p>
                    <Card.Text className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
                      Voted on: {new Date(vote.voted_at).toLocaleString()}
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => viewPollResults(vote.poll_id)}
                      className="mt-auto"
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
  size="xl"
  centered
  scrollable
>
  <Modal.Header closeButton>
    <Modal.Title>
      {selectedPoll ? selectedPoll.title : "Poll Results"}
    </Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {selectedPoll && (
      <Container fluid>
        <p>
          <strong>Description:</strong>{" "}
          {selectedPoll.description || "No description."}
        </p>
        <p>
          <strong>Total Votes:</strong> {selectedPoll.total_votes}
        </p>

        <Tabs defaultActiveKey="options" className="mb-3">
          {selectedPoll.options?.length > 0 && (
            <Tab eventKey="options" title="Options">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={selectedPoll.options}>
                  <XAxis dataKey="option_text" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votes" fill="#0d6efd" />
                </BarChart>
              </ResponsiveContainer>

              <div style={{ width: "100%", height: 300, marginTop: 20 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={selectedPoll.options}
                      dataKey="votes"
                      nameKey="option_text"
                      outerRadius={100}
                      label
                    >
                      {selectedPoll.options.map((_, index) => (
                        <Cell
                          key={index}
                          fill={generateColors(selectedPoll.options.length)[index]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Tab>
          )}

          {selectedPoll.candidates?.length > 0 && (
            <Tab eventKey="candidates" title="Candidates">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={selectedPoll.candidates}>
                  <XAxis dataKey="full_name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votes" fill="#198754" />
                </BarChart>
              </ResponsiveContainer>

              <div style={{ width: "100%", height: 300, marginTop: 20 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={selectedPoll.candidates}
                      dataKey="votes"
                      nameKey="full_name"
                      outerRadius={100}
                      label
                    >
                      {selectedPoll.candidates.map((_, index) => (
                        <Cell
                          key={index}
                          fill={generateColors(selectedPoll.candidates.length)[index]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Tab>
          )}
        </Tabs>
      </Container>
    )}
  </Modal.Body>
</Modal>

      </Container>
      {/* Footer */}
<footer className="bg-primary text-white text-center py-3 mt-auto">
  <Container>
    <small>© 2025 Nesux Voting System. All Rights Reserved.</small>
  </Container>
</footer>

    </div>
  );
};

export default VotingHistoryPage;
