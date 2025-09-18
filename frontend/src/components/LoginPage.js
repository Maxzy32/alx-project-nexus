// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
// import { loginUser } from "../ApiCalls/api";

// const LoginPage = ({ setUser }) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Auto-login if token exists in localStorage
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       setUser({ userId: payload.user_id, username: payload.username });
//     }
//   }, [setUser]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await loginUser(username, password);
//       const { access, refresh } = res.data;

//       // Save tokens
//       if (rememberMe) {
//         localStorage.setItem("accessToken", access);
//         localStorage.setItem("refreshToken", refresh);
//       } else {
//         sessionStorage.setItem("accessToken", access);
//         sessionStorage.setItem("refreshToken", refresh);
//       }

//       // Decode JWT to get user info
//       const payload = JSON.parse(atob(access.split(".")[1]));
//       setUser({ userId: payload.user_id, username: payload.username });

//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container fluid className="d-flex align-items-center justify-content-center vh-100 bg-light">
//       <Row>
//         <Col>
//           <Card className="p-4 shadow-lg" style={{ minWidth: "350px" }}>
//             <Card.Body>
//               <h3 className="text-center mb-4 text-primary">Login to Nesux</h3>
//               {error && <Alert variant="danger">{error}</Alert>}

//               <Form onSubmit={handleLogin}>
//                 <Form.Group className="mb-3" controlId="formUsername">
//                   <Form.Label>Username</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3" controlId="formPassword">
//                   <Form.Label>Password</Form.Label>
//                   <InputGroup>
//                     <Form.Control
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />
//                     <Button
//                       variant="outline-secondary"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? "Hide" : "Show"}
//                     </Button>
//                   </InputGroup>
//                 </Form.Group>

//                 <Form.Group className="mb-3" controlId="formRememberMe">
//                   <Form.Check
//                     type="checkbox"
//                     label="Remember Me"
//                     checked={rememberMe}
//                     onChange={(e) => setRememberMe(e.target.checked)}
//                   />
//                 </Form.Group>

//                 <Button variant="primary" type="submit" className="w-100" disabled={loading}>
//                   {loading ? "Logging in..." : "Login"}
//                 </Button>
//               </Form>

//               <div className="mt-3 text-center">
//                 <small className="text-muted">© 2025 Nesux Voting System</small>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default LoginPage;




// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { loginUser } from "../ApiCalls/api";

// const LoginPage = ({ setUser }) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Auto-login if token exists in localStorage
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       setUser({ userId: payload.user_id, username: payload.username });
//     }
//   }, [setUser]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await loginUser(username, password);
//       const { access, refresh } = res.data;

//       // Save tokens
//       if (rememberMe) {
//         localStorage.setItem("accessToken", access);
//         localStorage.setItem("refreshToken", refresh);
//       } else {
//         sessionStorage.setItem("accessToken", access);
//         sessionStorage.setItem("refreshToken", refresh);
//       }

//       // Decode JWT to get user info
//       const payload = JSON.parse(atob(access.split(".")[1]));
//       setUser({ userId: payload.user_id, username: payload.username });

//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container
//       fluid
//       className="d-flex align-items-center justify-content-center vh-100"
//       style={{
//         background: "url('https://images.unsplash.com/photo-1601597117730-0a5c3d6c60d0?auto=format&fit=crop&w=1740&q=80') no-repeat center center",
//         backgroundSize: "cover",
//       }}
//     >
//       <Row>
//         <Col>
//           <Card className="p-4 shadow-lg" style={{ minWidth: "350px", backdropFilter: "blur(10px)", backgroundColor: "rgba(255,255,255,0.85)" }}>
//             <Card.Body>
//               <h3 className="text-center mb-4 text-primary">Login to Nesux</h3>
//               {error && <Alert variant="danger">{error}</Alert>}

//               <Form onSubmit={handleLogin}>
//                 <Form.Group className="mb-3" controlId="formUsername">
//                   <Form.Label>Username</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3" controlId="formPassword">
//                   <Form.Label>Password</Form.Label>
//                   <InputGroup>
//                     <Form.Control
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />
//                     <Button
//                       variant="outline-secondary"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <FaEyeSlash /> : <FaEye />}
//                     </Button>
//                   </InputGroup>
//                 </Form.Group>

//                 <Form.Group className="mb-3" controlId="formRememberMe">
//                   <Form.Check
//                     type="checkbox"
//                     label="Remember Me"
//                     checked={rememberMe}
//                     onChange={(e) => setRememberMe(e.target.checked)}
//                   />
//                 </Form.Group>

//                 <Button variant="primary" type="submit" className="w-100" disabled={loading}>
//                   {loading ? "Logging in..." : "Login"}
//                 </Button>
//               </Form>

//               <div className="mt-3 text-center">
//                 <small className="text-muted">© 2025 Nesux Voting System</small>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default LoginPage;






import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../ApiCalls/api";

const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ userId: payload.user_id, username: payload.username });
    }
  }, [setUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(username, password);
      const { access, refresh } = res.data;

      // Save tokens
      // Save tokens
if (rememberMe) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
} else {
  sessionStorage.setItem("access_token", access);
  sessionStorage.setItem("refresh_token", refresh);
}


      // Decode JWT
      const payload = JSON.parse(atob(access.split(".")[1]));
      setUser({ userId: payload.user_id, username: payload.username });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background:
          "url('https://images.unsplash.com/photo-1601597117730-0a5c3d6c60d0?auto=format&fit=crop&w=1740&q=80') no-repeat center center",
        backgroundSize: "cover",
      }}
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
              <h3 className="text-center mb-4 text-primary">Login to Nesux</h3>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleLogin}>
                {/* Username */}
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Password */}
                {/* Password */}
<Form.Group className="mb-3" controlId="formPassword">
  <Form.Label>Password</Form.Label>
  <div style={{ position: "relative" }}>
    <Form.Control
      type={showPassword ? "text" : "password"}
      placeholder="Enter password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      style={{ paddingRight: "40px" }} // extra space for the eye icon
    />
    <span
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: "absolute",
        top: "50%",
        right: "10px",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#555",
      }}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</Form.Group>


                {/* Remember me */}
                <Form.Group className="mb-3" controlId="formRememberMe">
                  <Form.Check
                    type="checkbox"
                    label="Remember Me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                </Form.Group>

                {/* Submit */}
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
                <small className="text-muted">
                  © 2025 Nesux Voting System
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
