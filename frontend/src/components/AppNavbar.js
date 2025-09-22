import React, { useContext, useState } from "react";
import { Navbar, Nav, Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

const AppNavbar = () => {
  const { user, logout } = useContext(UserContext);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="position-relative">
      <Container>
        <Navbar.Brand href="#">⚡ Nesux Polls</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user && (
              <>
                <Nav.Link as={Link} to="/polls">Polls</Nav.Link>
                <Nav.Link as={Link} to="/results">Results</Nav.Link>
                {user.username === "admin" && (
                  <>
                    <Nav.Link as={Link} to="/polls/adminmanager">Manage Polls</Nav.Link>
                    <Nav.Link as={Link} to="/users_manager">Manage Users</Nav.Link>
                    <Nav.Link as={Link} to="/general_history">Voting Outcomes</Nav.Link>
                  </>
                )}
                <Nav.Link onClick={() => setShowProfile(prev => !prev)}>Logout</Nav.Link>
              </>
            )}
            {!user && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
          </Nav>
        </Navbar.Collapse>

        {/* Profile Card positioned under navbar */}
        {showProfile && user && (
          <div
            className="position-absolute mt-2"
            style={{
              top: "100%",
              right: "1rem",
              zIndex: 1000,
              minWidth: "200px",
              maxWidth: "90vw",
            }}
          >
            <Card className="shadow-lg border-0">
              <Card.Body className="text-center">
                <Card.Title className="fw-bold">User Profile 👤</Card.Title>
                <Card.Text>
                  Logged in as <b>{user.username}</b>
                </Card.Text>
                <Button
                  variant="outline-danger"
                  onClick={() => {
                    logout();
                    setShowProfile(false);
                  }}
                >
                  Logout
                </Button>
              </Card.Body>
            </Card>
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
