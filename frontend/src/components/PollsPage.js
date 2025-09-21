


import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  ProgressBar,
} from "react-bootstrap";
import {
  fetchActivePoll,
  fetchPollResults,
  submitVote,
  connectToPollResults,
} from "../ApiCalls/api";
import AppNavbar from "./AppNavbar";
import CountdownTimer from "./CountdownTimer";

function PollsPage({ user }) {
  const [polls, setPolls] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [showProfile, setShowProfile] = useState(false);

  // ✅ Load initial polls + results
  useEffect(() => {
  const loadPolls = async () => {
    try {
      setLoading(true);

      const res = await fetchActivePoll();
      const activePolls = Array.isArray(res.data) ? res.data : [res.data];

      const pollsWithResults = await Promise.all(
        activePolls.map(async (poll) => {
          try {
            const resultRes = await fetchPollResults(poll.poll_id);
            const results = resultRes.data;

            return {
              ...poll, // keep title, description, created_at, end_time
              total_votes: results.total_votes ?? 0,
              options: results.options ?? poll.options,
              candidates: results.candidates ?? poll.candidates,
            };
          } catch (err) {
            console.error(`Failed to fetch results for poll ${poll.poll_id}`, err);
            return poll;
          }
        })
      );

      setPolls((prev) => {
        // Merge with existing polls, newest first
        const merged = pollsWithResults.map((p) => {
          const existing = prev.find((old) => old.poll_id === p.poll_id);
          return existing ? { ...existing, ...p } : p;
        });

        // Add any old polls that were not in new fetch (should be rare)
        const oldPolls = prev.filter(
          (p) => !pollsWithResults.find((newP) => newP.poll_id === p.poll_id)
        );

        return [...merged, ...oldPolls].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      });

      setError("");
    } catch (err) {
      console.error("Error fetching active polls:", err);
      setError("No active polls available right now.");
    } finally {
      setLoading(false);
    }
  };

  loadPolls();
}, []);


useEffect(() => {
  if (!polls.length) return;

  const sockets = polls.map((poll) =>
    connectToPollResults(poll.poll_id, (data) => {
      setPolls((prev) =>
        prev.map((p) => {
          if (p.poll_id !== data.poll_id) return p;

          // Case 1: Full snapshot
          if (data.results || data.options || data.candidates) {
            return {
              ...p,
              total_votes: data.total_votes ?? p.total_votes,
              options: data.results?.options ?? data.options ?? p.options,
              candidates: data.results?.candidates ?? data.candidates ?? p.candidates,
            };
          }

          // Case 2: Delta update (single option/candidate)
          return {
            ...p,
            total_votes: data.total_votes ?? p.total_votes,
            options: p.options?.map((opt) =>
              opt.option_id === data.option_id ? { ...opt, votes: data.votes } : opt
            ),
            candidates: p.candidates?.map((cand) =>
              cand.candidate_id === data.candidate_id ? { ...cand, votes: data.votes } : cand
            ),
          };
        })
      );
    })
  );

  return () => sockets.forEach((socket) => socket.close());
}, [polls.length]);





  // ✅ Handle vote submission
  const handleVote = async (poll) => {
    if (!selectedOption && !selectedCandidate) {
      alert("Please select an option or a candidate first.");
      return;
    }
    if (!user) {
      alert("You must be logged in to vote.");
      return;
    }

    if (!window.confirm("Are you sure you want to submit this vote?")) return;

    try {
      await submitVote({
        poll: poll.poll_id,
        option: selectedOption || null,
        candidate: selectedCandidate || null,
      });

      alert("Vote submitted successfully!");
      setSelectedOption(null);
      setSelectedCandidate(null);
    } catch (err) {
      console.error("Error submitting vote:", err);
      alert("You have already voted in this poll.");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">


<AppNavbar/>


      {/* Hero Section */}
      <section className="bg-light py-5 text-center">
        <Container>
          <h1 className="fw-bold">Welcome to Nesux Polls 🎉</h1>
          <p className="lead">
            Vote on your favorite topics or candidates and see live results.
          </p>
        </Container>
      </section>

      <section
  className="d-flex justify-content-center align-items-center mt-3"
   // full height minus navbar/footer
>
  <Container>
    <Row className="justify-content-center">
       <Col md={8}>
            {loading && <p>Loading active polls...</p>}
            {!loading && error && <p className="text-danger">{error}</p>}

            {polls.map((poll) => (
              <Card key={poll.poll_id} className="mb-4 shadow-lg border-0">
                <Card.Body>
                  <Card.Title className="fw-bold text-primary">
                    {poll.title || "Untitled Poll"}
                  </Card.Title>
                  <Card.Text >
                    {poll.description || "No description available."}
                  </Card.Text>

                  <CountdownTimer endTime={poll.end_time} startTime={poll.created_at} />


                  
                  <p className="fw-bold text-success">
                    Total Votes: {poll.total_votes || 0}
                  </p>

                  
                  {poll.options?.length > 0 && (
                    <ListGroup className="mb-3">
                      <h6>Options:</h6>
                      {poll.options.map((option) => (
                        <ListGroup.Item
                          key={option.option_id}
                          action
                          active={selectedOption === option.option_id}
                          onClick={() => {
                            setSelectedOption(option.option_id);
                            setSelectedCandidate(null);
                          }}
                        >
                          {option.option_text}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}

                  
                  {poll.candidates?.length > 0 && (
                    <ListGroup className="mb-3">
                      <h6>Candidates:</h6>
                      {poll.candidates.map((candidate) => (
                        <ListGroup.Item
                          key={candidate.candidate_id}
                          action
                          active={selectedCandidate === candidate.candidate_id}
                          onClick={() => {
                            setSelectedCandidate(candidate.candidate_id);
                            setSelectedOption(null);
                          }}
                        >
                          {candidate.full_name}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}

                  <Button
                    variant="success"
                    className="mt-3 me-2"
                    onClick={() => handleVote(poll)}
                  >
                    Submit Vote
                  </Button>

                  
                  <h5 className="mt-4 fw-bold text-primary">Live Results</h5>
                  {poll.options?.map((option) => {
                    const votes = option.votes || 0;
                    const percentage = poll.total_votes
                      ? Math.round((votes / poll.total_votes) * 100)
                      : 0;
                    return (
                      <div key={option.option_id} className="mb-3">
                        <span>
                          {option.option_text} — <b>{votes} votes</b>
                        </span>
                        <ProgressBar
                          now={percentage}
                          label={`${percentage}%`}
                          className="mb-2"
                        />
                      </div>
                    );
                  })}

                  {poll.candidates?.map((candidate) => {
                    const votes = candidate.votes || 0;
                    const percentage = poll.total_votes
                      ? Math.round((votes / poll.total_votes) * 100)
                      : 0;
                    return (
                      <div key={candidate.candidate_id} className="mb-3">
                        <span>
                          {candidate.full_name} — <b>{votes} votes</b>
                        </span>
                        <ProgressBar
                          now={percentage}
                          label={`${percentage}%`}
                          className="mb-2 bg-warning"
                        />
                      </div>
                    );
                  })}
                </Card.Body>
              </Card>
            ))}
          </Col>

    </Row>
  </Container>
</section>


      {/* Footer */}
<footer className="bg-primary text-white text-center py-3 mt-auto">
  <Container>
    <small>© 2025 Nesux Voting System. All Rights Reserved.</small>
  </Container>
</footer>

    </div>
  );
}

export default PollsPage;
