

import React, { useState, useContext } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../ApiCalls/api";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ stop form from reloading
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(username, password);

      // Handle axios vs fetch response
      const data = res?.data ? res.data : res;
      if (!data?.access) {
        throw { response: { status: 401 } }; // simulate unauthorized
      }

      const { access, refresh } = data;

      // Decode JWT
      const payload = JSON.parse(atob(access.split(".")[1]));
      const loggedInUser = { userId: payload.user_id, username: payload.username };

      // Save tokens + user
      if (rememberMe) {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
      } else {
        sessionStorage.setItem("access_token", access);
        sessionStorage.setItem("refresh_token", refresh);
        sessionStorage.setItem("user", JSON.stringify(loggedInUser));
      }

      // Update context
      setUser(loggedInUser);

      // Redirect
      navigate("/", { state: { user: loggedInUser } });
    } catch (err) {
      console.error("Login error:", err);

      // ✅ prevent reload on failure
      
  if (err.response?.status === 401) {
    // Use backend's exact error message
    setError(err.response?.data?.error || "Unauthorized");
  } else {
    setError("Login failed. Please try again.");
  }
      return; // <-- stops execution cleanly
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center vh-100"
      // style={{
      //   background:
      //     "url('https://images.unsplash.com/photo-1601597117730-0a5c3d6c60d0?auto=format&fit=crop&w=1740&q=80') no-repeat center center",
      //   backgroundSize: "cover",
      // }}
    >
      <Row>
        <Col>
          <Card
            className="p-4 shadow-lg"
            style={{
              minWidth: "350px",
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255,255,255,0.85)",
            }}
          >
            <Card.Body>
              <h3 className="text-center mb-4 text-primary">
                Login to Nexus Voting App
              </h3>
              {error && <Alert variant="danger">{error}</Alert>}

              {/* ✅ Ensure form won't auto-submit */}
              <Form onSubmit={handleLogin} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ paddingRight: "40px" }}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Remember Me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Form>
              <div className="mt-3 text-center">
                <small className="text-muted">© 2025 Nexus Voting System</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
