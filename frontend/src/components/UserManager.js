// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { fetchUsers, createUser, updateUser, deleteUser } from "../ApiCalls/api";
// import { Modal, Button, Form, Table } from "react-bootstrap";
// import { Navbar, Container, Nav } from "react-bootstrap";

// const UserManager = () => {
//   const [users, setUsers] = useState([]);
//   const [formData, setFormData] = useState({ username: "", email: "", password: "" });
//   const [editingUser, setEditingUser] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const loadUsers = async () => {
//     try {
//       const res = await fetchUsers();
//       setUsers(res.data);
//     } catch (err) {
//       console.error("Error fetching users:", err);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     try {
//       await createUser(formData);
//       setFormData({ username: "", email: "", password: "" });
//       loadUsers();
//     } catch (err) {
//       console.error("Error creating user:", err);
//     }
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setFormData({ username: user.username, email: user.email, password: "" });
//     setShowModal(true);
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await updateUser(editingUser.user_id, {
//         username: formData.username,
//         email: formData.email,
//         ...(formData.password && { password: formData.password }), // optional password change
//       });
//       setEditingUser(null);
//       setShowModal(false);
//       loadUsers();
//     } catch (err) {
//       console.error("Error updating user:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await deleteUser(id);
//       loadUsers();
//     } catch (err) {
//       console.error("Error deleting user:", err);
//     }
//   };

//   return (

    //  <div className="d-flex flex-column min-vh-100">
          
    //   <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
    //     <Container>
    //       <Navbar.Brand href="#">⚡ Nesux Polls</Navbar.Brand>
    //       <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //       <Navbar.Collapse id="basic-navbar-nav">
    //         <Nav className="ms-auto">
    //           <Nav.Link as={Link} to="/">
    //             Polls
    //           </Nav.Link>
    //           <Nav.Link as={Link} to="/results">
    //             Results
    //           </Nav.Link>
    //           <Nav.Link href="#profile">Profile</Nav.Link>
    //         </Nav>
    //       </Navbar.Collapse>
    //     </Container>
    //   </Navbar>
    

//     <div className="container mt-4">
//       <h2>Create User</h2>
//       <Form onSubmit={handleCreate} className="mb-4">
//         <Form.Group className="mb-2">
//           <Form.Control
//             type="text"
//             name="username"
//             placeholder="Username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </Form.Group>
//         <Form.Group className="mb-2">
//           <Form.Control
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </Form.Group>
//         <Form.Group className="mb-2">
//           <Form.Control
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </Form.Group>
//         <Button type="submit" variant="primary">Create</Button>
//       </Form>

//       <h2>Users</h2>
//       <Table bordered hover>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Username</th>
//             <th>Email</th>
//             <th>Active</th>
//             <th>Must Change Password</th>
//             <th>Created At</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((u) => (
//             <tr key={u.user_id}>
//               <td>{u.user_id}</td>
//               <td>{u.username}</td>
//               <td>{u.email}</td>
//               <td>{u.is_active ? "Yes" : "No"}</td>
//               <td>{u.must_change_password ? "Yes" : "No"}</td>
//               <td>{new Date(u.created_at).toLocaleDateString()}</td>
//               <td>
//                 <Button variant="warning" size="sm" onClick={() => handleEdit(u)}>Edit</Button>{" "}
//                 <Button variant="danger" size="sm" onClick={() => handleDelete(u.user_id)}>Delete</Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       {/* Edit Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton><Modal.Title>Edit User</Modal.Title></Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleUpdate}>
//             <Form.Group className="mb-2">
//               <Form.Control
//                 type="text"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Control
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Control
//                 type="password"
//                 name="password"
//                 placeholder="New password (leave blank to keep unchanged)"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//             <Button type="submit" variant="primary">Save</Button>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </div>

// <footer className="bg-primary text-white text-center py-3 mt-auto">
//         <Container>
//           <small>© 2025 Nesux Voting System. All Rights Reserved.</small>
//         </Container>
//       </footer>
//     </div>
//   );
// };

// export default UserManager;


// src/components/UserManager.js
// import React, { useState, useEffect } from "react";
// import {
//   fetchUsers,
//   createUser,
//   updateUser,
//   deleteUser,
// } from "../ApiCalls/api";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   InputGroup,
//   Navbar,
//   Container,
//   Nav,
// } from "react-bootstrap";
// import { Link } from "react-router-dom";

// const UserManager = () => {
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });

//   // Load users
//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const loadUsers = async () => {
//     try {
//       const res = await fetchUsers();
//       setUsers(res.data);
//     } catch (err) {
//       console.error("Error fetching users:", err);
//     }
//   };

//   // Input change handler
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Show modal (for create or edit)
//   const handleShowModal = (user = null) => {
//     if (user) {
//       setEditingUser(user);
//       setFormData({ username: user.username, email: user.email, password: "" });
//     } else {
//       setEditingUser(null);
//       setFormData({ username: "", email: "", password: "" });
//     }
//     setShowModal(true);
//   };

//   // Close modal
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingUser(null);
//     setFormData({ username: "", email: "", password: "" });
//   };

//   // Create user
//   const handleCreate = async (e) => {
//     e.preventDefault();
//     try {
//       await createUser(formData);
//       setFormData({ username: "", email: "", password: "" });
//       loadUsers();
//       setShowModal(false);
//     } catch (err) {
//       console.error("Error creating user:", err);
//     }
//   };

//   // Update user
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await updateUser(editingUser.user_id, {
//         username: formData.username,
//         email: formData.email,
//         ...(formData.password && { password: formData.password }),
//       });
//       setEditingUser(null);
//       setShowModal(false);
//       loadUsers();
//     } catch (err) {
//       console.error("Error updating user:", err);
//     }
//   };

//   // Delete user
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await deleteUser(id);
//       loadUsers();
//     } catch (err) {
//       console.error("Error deleting user:", err);
//     }
//   };

//   // Filter users
//   const filteredUsers = users.filter(
//     (u) =>
//       u.username.toLowerCase().includes(search.toLowerCase()) ||
//       u.email.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="d-flex flex-column min-vh-100">
//       {/* Navbar */}
//       <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
//         <Container>
//           <Navbar.Brand href="#">⚡ Nexus Polls</Navbar.Brand>
//           <Navbar.Toggle aria-controls="basic-navbar-nav" />
//           <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="ms-auto">
//               <Nav.Link as={Link} to="/">
//                 Polls
//               </Nav.Link>
//               <Nav.Link as={Link} to="/results">
//                 Results
//               </Nav.Link>
//               <Nav.Link href="#profile">Profile</Nav.Link>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* Main Content */}
//       <div className="container mt-4">
//         <h2 className="mb-3">User Management</h2>

//         {/* Search + Add Button */}
//         <div className="d-flex justify-content-between mb-3">
//           <InputGroup style={{ width: "300px" }}>
//             <Form.Control
//               type="text"
//               placeholder="Search users..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </InputGroup>
//           <Button variant="primary" onClick={() => handleShowModal()}>
//             + Add User
//           </Button>
//         </div>

//         {/* Users Table */}
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Username</th>
//               <th>Email</th>
//               <th>Active</th>
//               <th>Created At</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.map((u) => (
//               <tr key={u.user_id}>
//                 <td>{u.user_id}</td>
//                 <td>{u.username}</td>
//                 <td>{u.email}</td>
//                 <td>{u.is_active ? "Yes" : "No"}</td>
//                 <td>{new Date(u.created_at).toLocaleDateString()}</td>
//                 <td>
//                   <Button
//                     size="sm"
//                     variant="warning"
//                     onClick={() => handleShowModal(u)}
//                     className="me-2"
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="danger"
//                     onClick={() => handleDelete(u.user_id)}
//                   >
//                     Delete
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//             {filteredUsers.length === 0 && (
//               <tr>
//                 <td colSpan="6" className="text-center text-muted">
//                   No users found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>

//         {/* Modal */}
//         <Modal show={showModal} onHide={handleCloseModal}>
//           <Modal.Header closeButton>
//             <Modal.Title>
//               {editingUser ? "Edit User" : "Create User"}
//             </Modal.Title>
//           </Modal.Header>
//           <Form onSubmit={editingUser ? handleUpdate : handleCreate}>
//             <Modal.Body>
//               <Form.Group className="mb-3">
//                 <Form.Label>Username</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>

//               {!editingUser && (
//                 <Form.Group className="mb-3">
//                   <Form.Label>Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                   />
//                 </Form.Group>
//               )}
//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={handleCloseModal}>
//                 Cancel
//               </Button>
//               <Button type="submit" variant="primary">
//                 {editingUser ? "Save Changes" : "Create"}
//               </Button>
//             </Modal.Footer>
//           </Form>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default UserManager;

import React, { useState, useEffect } from "react";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../ApiCalls/api";
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  Navbar,
  Container,
  Nav,
} from "react-bootstrap";
import AppNavbar from "./AppNavbar";
import { Link } from "react-router-dom";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetchUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Show modal (for create or edit)
  const handleShowModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ username: user.username, email: user.email, password: "" });
    } else {
      setEditingUser(null);
      setFormData({ username: "", email: "", password: "" });
    }
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ username: "", email: "", password: "" });
  };

  // Create user
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setFormData({ username: "", email: "", password: "" });
      loadUsers();
      setShowModal(false);
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  // Update user
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser.user_id, {
        username: formData.username,
        email: formData.email,
        ...(formData.password && { password: formData.password }), // only send if not empty
      });
      setEditingUser(null);
      setShowModal(false);
      loadUsers();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Filter users
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      {/* <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="#">⚡ Nexus Polls</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">
                Polls
              </Nav.Link>
              <Nav.Link as={Link} to="/results">
                Results
              </Nav.Link>
              <Nav.Link href="#profile">Profile</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar> */}
      <AppNavbar/>

      {/* Main Content */}
      <div className="container mt-4">
        <h2 className="mb-3">User Management</h2>

        {/* Search + Add Button */}
        <div className="d-flex justify-content-between mb-3">
          <InputGroup style={{ width: "300px" }}>
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <Button variant="primary" onClick={() => handleShowModal()}>
            + Add User
          </Button>
        </div>

        {/* Users Table */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Active</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.is_active ? "Yes" : "No"}</td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleShowModal(u)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(u.user_id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingUser ? "Edit User" : "Create User"}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={editingUser ? handleUpdate : handleCreate}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Always show password field */}
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    editingUser
                      ? "Leave blank to keep current password"
                      : "Enter password"
                  }
                  required={!editingUser} // required only on create
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingUser ? "Save Changes" : "Create"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UserManager;
