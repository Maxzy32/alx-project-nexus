
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Container,
  Badge,
  Modal,
  Table,
  Tabs,
  Tab,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import AppNavbar from "./AppNavbar";

import { fetchAdminPolls, fetchPollResults } from "../ApiCalls/api";

// Generate vibrant colors for charts
const generateColors = (count) =>
  Array.from({ length: count }, (_, i) => `hsl(${(i * 360) / count}, 70%, 50%)`);

const VotingOutcomes = () => {
//   const [polls, setHistory] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [optionSort, setOptionSort] = useState({ field: "votes", asc: false });
  const [candidateSort, setCandidateSort] = useState({ field: "votes", asc: false });
  const [polls, setPolls] = useState([]);


useEffect(() => {
  const loadPolls = async () => {
    try {
      const res = await fetchAdminPolls();
      setPolls(res.data);
      console.log("Polls Coming In", res)
    } catch (err) {
      console.error("Failed to load admin polls:", err);
    }
  };
  loadPolls();
}, []);

  const viewPollResults = async (pollId) => {
    try {
      const response = await fetchPollResults(pollId);

      response.data.options = response.data.options?.map((opt) => ({
        ...opt,
        voters: opt.voters || [],
      })) || [];
      console.log("The of voters coming in", response)

      response.data.candidates = response.data.candidates?.map((cand) => ({
        ...cand,
        voters: cand.voters || [],
      })) || [];

      response.data.options.sort((a, b) => b.votes - a.votes);
      response.data.candidates.sort((a, b) => b.votes - a.votes);

      setSelectedPoll(response.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to load poll results:", err);
    }
  };

  const sortTable = (data, field, asc) => {
    const sorted = [...data].sort((a, b) => {
      if (typeof a[field] === "string") {
        return asc ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
      } else {
        return asc ? a[field] - b[field] : b[field] - a[field];
      }
    });
    return sorted;
  };

  const handleOptionSort = (field) => {
    const asc = optionSort.field === field ? !optionSort.asc : true;
    setOptionSort({ field, asc });
    setSelectedPoll({
      ...selectedPoll,
      options: sortTable(selectedPoll.options, field, asc),
    });
  };

  const handleCandidateSort = (field) => {
    const asc = candidateSort.field === field ? !candidateSort.asc : true;
    setCandidateSort({ field, asc });
    setSelectedPoll({
      ...selectedPoll,
      candidates: sortTable(selectedPoll.candidates, field, asc),
    });
  };

  const renderVoters = (voters) => {
    if (!voters || voters.length === 0) return "None";
    const display = voters.length > 3
      ? `${voters.slice(0, 3).join(", ")} +${voters.length - 3} more`
      : voters.join(", ");
    return (
      <OverlayTrigger overlay={<Tooltip>{voters.join(", ")}</Tooltip>}>
        <span>{display}</span>
      </OverlayTrigger>
    );
  };

  return (
    <div className="d-flex flex-column min-vh-100">
     
      <AppNavbar/>

      <Container className="py-4">
        <h1 className="mb-4 text-center">🗳️ My Voting History</h1>

        {polls.length === 0 ? (
          <p className="text-muted text-center">You haven’t voted in any polls yet.</p>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {polls.map((poll) => (
              <Col key={poll.poll_id}>
                <Card className="shadow-sm h-100 hover-shadow">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold">{poll.poll_title}</Card.Title>
                    <p className="mb-2">
                      <strong>Vote Summary: </strong>
                      <Badge bg="info">{poll.option_text || poll.candidate_name}</Badge>
                    </p>
                    <Card.Text className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
                      Voted on: {new Date(poll.voted_at).toLocaleString()}
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => viewPollResults(poll.poll_id)}
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

        <Modal
  show={isModalOpen}
  onHide={() => setIsModalOpen(false)}
  size="xl"
  centered
  scrollable
>
  <Modal.Header closeButton>
    <Modal.Title>{selectedPoll?.title || "Poll Results"}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedPoll && (
      <Container fluid>
        <p><strong>Total Votes:</strong> {selectedPoll.total_votes}</p>

        <Tabs defaultActiveKey="options" className="mb-3">
          {/* OPTIONS TAB */}
          {selectedPoll.options?.length > 0 && (
            <Tab eventKey="options" title="Options">
              <h5 className="mt-3">Votes by Option</h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th
                      onClick={() => handleOptionSort("option_text")}
                      style={{ cursor: "pointer" }}
                    >
                      Option {optionSort.field === "option_text" ? (optionSort.asc ? "▲" : "▼") : ""}
                    </th>
                    <th
                      onClick={() => handleOptionSort("votes")}
                      style={{ cursor: "pointer" }}
                    >
                      Votes {optionSort.field === "votes" ? (optionSort.asc ? "▲" : "▼") : ""}
                    </th>
                    <th>Voters</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPoll.options.map((opt) => (
                    <tr key={opt.option_id}>
                      <td>{opt.option_text}</td>
                      <td>{opt.votes}</td>
                      <td style={{ maxWidth: "200px" }}>
                        <div style={{ maxHeight: "120px", overflowY: "auto" }}>
                          {opt.voters.length === 0 ? (
                            <span>None</span>
                          ) : (
                            opt.voters.map((voter, idx) => (
                              <OverlayTrigger key={idx} overlay={<Tooltip>{voter}</Tooltip>}>
                                <div>{voter}</div>
                              </OverlayTrigger>
                            ))
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Charts */}
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={selectedPoll.options}>
                  <XAxis dataKey="option_text" />
                  <YAxis />
                  <RechartsTooltip />
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
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Tab>
          )}

          {/* CANDIDATES TAB */}
         {/* OPTIONS TAB */}
{selectedPoll.options?.length > 0 && (
  <Tab eventKey="options" title="Options">
    <h5 className="mt-3">Votes by Option</h5>
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th
            onClick={() => handleOptionSort("option_text")}
            style={{ cursor: "pointer" }}
          >
            Option {optionSort.field === "option_text" ? (optionSort.asc ? "▲" : "▼") : ""}
          </th>
          <th>Voter</th>
        </tr>
      </thead>
      <tbody>
        {selectedPoll.options.map((opt) =>
          opt.voters.map((voter, idx) => (
            <tr key={`${opt.option_id}-${idx}`}>
              <td>{opt.option_text}</td>
              <td>{voter}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  </Tab>
)}

{/* CANDIDATES TAB */}
{selectedPoll.candidates?.length > 0 && (
  <Tab eventKey="candidates" title="Candidates">
    <h5 className="mt-3">Votes by Candidate</h5>
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th
            onClick={() => handleCandidateSort("full_name")}
            style={{ cursor: "pointer" }}
          >
            Candidate {candidateSort.field === "full_name" ? (candidateSort.asc ? "▲" : "▼") : ""}
          </th>
          <th>Voter</th>
        </tr>
      </thead>
      <tbody>
        {selectedPoll.candidates.map((cand) =>
          cand.voters.map((voter, idx) => (
            <tr key={`${cand.candidate_id}-${idx}`}>
              <td>{cand.full_name}</td>
              <td>{voter}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  </Tab>
)}

        </Tabs>
      </Container>
    )}
  </Modal.Body>
</Modal>

      </Container>

      <footer className="bg-primary text-white text-center py-3 mt-auto">
        <Container>
          <small>© 2025 Nesux Voting System. All Rights Reserved.</small>
        </Container>
      </footer>
    </div>
  );
};

export default VotingOutcomes;
