import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  fetchPolls,
  createPoll,
  updatePoll,
  deletePoll,
  togglePollStatus,
  createPollOption,
  updatePollOption,
  deletePollOption,
} from "../ApiCalls/api";
import { Navbar, Container, Nav } from "react-bootstrap";
import AppNavbar from "./AppNavbar";
import { UserContext } from "./UserContext"; 

const PollManager = () => {
  const [polls, setPolls] = useState([]);
  const [search, setSearch] = useState("");
  const [editingPoll, setEditingPoll] = useState(null);
  const [formData, setFormData] = useState({
    poll_id: 0,
    creator_id: "", // will come from auth later
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    is_active: true,
    created_at: "",
  });
  const [newOption, setNewOption] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);

  const rowsPerPage = 8;

  
  const { user } = useContext(UserContext);

      const userId = user?.userId;

    console.log("User id is", userId)
  // Fetch polls
  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = async () => {
    try {
      const res = await fetchPolls();
      setPolls(res.data);
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  };

  // Handle poll input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create poll
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
     await createPoll({
  creator_id: userId,  // matches serializer field
  title: formData.title,
  description: formData.description,
  start_time: new Date(formData.start_time).toISOString(),
  end_time: new Date(formData.end_time).toISOString(),
  is_active: formData.is_active,
});



      resetForm();
      loadPolls();
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      poll_id: 0,
      creator_id: "",
      title: "",
      description: "",
      start_time: "",
      end_time: "",
      is_active: true,
      created_at: "",
    });
    setNewOption("");
  };

  // Delete poll
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this poll?")) return;
    try {
      await deletePoll(id);
      loadPolls();
    } catch (error) {
      console.error("Error deleting poll:", error);
    }
  };

  // Edit poll
  const handleEdit = (poll) => {
    setEditingPoll(poll);
    setFormData({
      poll_id: poll.poll_id,
      creator_id: poll.creator_id,
      title: poll.title,
      description: poll.description,
      start_time: poll.start_time,
      end_time: poll.end_time,
      is_active: poll.is_active,
      created_at: poll.created_at,
    });
    setShowModal(true);
  };

  // Update poll
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingPoll) return;

    try {
      await updatePoll(editingPoll.poll_id, {
        title: formData.title,
        description: formData.description,
        start_time: formData.start_time,
        end_time: formData.end_time,
        is_active: formData.is_active,
      });

      setEditingPoll(null);
      setShowModal(false);
      resetForm();
      loadPolls();
    } catch (error) {
      console.error("Error updating poll:", error);
    }
  };

  // Toggle poll status
  const handleToggleStatus = async (poll) => {
    try {
      await togglePollStatus(poll.poll_id, { is_active: !poll.is_active });
      loadPolls();
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  // Add option
  const handleAddOption = async (pollId) => {
  if (!newOption.trim()) return;
  try {
    const payload = { poll_id: pollId, option_text: newOption };
    console.log("Payload:", payload); // log before sending
    await createPollOption(payload); // pass only one argument
    
    setNewOption("");
    loadPolls();
  } catch (error) {
    console.error("Error adding option:", error.response?.data || error);
  }
};


  // Update option
  const handleUpdateOption = async (optionId, newText) => {
    try {
      await updatePollOption(optionId, { option_text: newText });
      loadPolls();
    } catch (error) {
      console.error("Error updating option:", error);
    }
  };

  // Delete option
  const handleDeleteOption = async (optionId) => {
    if (!window.confirm("Delete this option?")) return;
    try {
      await deletePollOption(optionId);
      loadPolls();
    } catch (error) {
      console.error("Error deleting option:", error);
    }
  };

  // Filter polls
  const filteredPolls = polls.filter(
    (poll) =>
      poll.title.toLowerCase().includes(search.toLowerCase()) ||
      poll.description.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredPolls.length / rowsPerPage);
  const paginatedPolls = viewAll
    ? filteredPolls
    : filteredPolls.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      {/* <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="#">⚡ Nesux Polls</Navbar.Brand>
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
      <div className="container py-4">
        {/* Create Poll Form */}
        <div className="card mb-4 shadow">
          <div className="card-body">
            <h2 className="h5 fw-bold mb-3">Create Poll</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <input
                  type="text"
                  name="title"
                  placeholder="Poll Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  name="description"
                  placeholder="Poll Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <input
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="datetime-local"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Create Poll
              </button>
            </form>
          </div>
        </div>

        {/* Polls Table */}
        <div className="card shadow">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-bold">Polls</h2>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  style={{ maxWidth: "200px" }}
                />
                <button
                  onClick={() => setViewAll(!viewAll)}
                  className="btn btn-success"
                >
                  {viewAll ? "Paginate" : "View All"}
                </button>
              </div>
            </div>

            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Options</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Active</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPolls.map((poll) => (
                  <tr key={poll.poll_id}>
                    <td>{poll.poll_id}</td>
                    <td>{poll.title}</td>
                    <td>
                      {poll.description.length > 20
                        ? poll.description.slice(0, 20) + "..."
                        : poll.description}
                    </td>
                    <td>
                      <ul className="list-unstyled">
                        {poll.options?.map((opt) => (
                          <li key={opt.option_id} className="d-flex align-items-center mb-1">
                            <input
                              type="text"
                              defaultValue={opt.option_text}
                              className="form-control form-control-sm me-2"
                              onBlur={(e) =>
                                handleUpdateOption(opt.option_id, e.target.value)
                              }
                            />
                            <button
                              onClick={() => handleDeleteOption(opt.option_id)}
                              className="btn btn-sm btn-danger"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                        <li className="d-flex mt-2">
                          <input
                            type="text"
                            placeholder="New option"
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}
                            className="form-control form-control-sm me-2"
                          />
                          <button
                            onClick={() => handleAddOption(poll.poll_id)}
                            className="btn btn-sm btn-success"
                          >
                            +
                          </button>
                        </li>
                      </ul>
                    </td>
                    <td>{new Date(poll.start_time).toLocaleString()}</td>
                    <td>{new Date(poll.end_time).toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          poll.is_active ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {poll.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="d-flex gap-2">
                    <button
                    onClick={() => handleEdit(poll)}
                    className="btn btn-warning btn-sm"
                    >
                    Edit
                    </button>
                      <button
                        onClick={() => handleDelete(poll.poll_id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleToggleStatus(poll)}
                        className={`btn btn-sm ${
                          poll.is_active ? "btn-secondary" : "btn-success"
                        }`}
                      >
                        {poll.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPolls.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-3">
                      No polls found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {!viewAll && totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="btn btn-outline-secondary btn-sm"
                >
                  ← Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="btn btn-outline-secondary btn-sm"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Edit Poll Modal */}
{showModal && (
  <div
    className="modal fade show"
    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Edit Poll</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
          ></button>
        </div>
        <form onSubmit={handleUpdate}>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Start Time</label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">End Time</label>
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="form-check-input"
              />
              <label className="form-check-label">Active</label>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

      </div>

      <footer className="bg-primary text-white text-center py-3 mt-auto">
        <Container>
          <small>© 2025 Nesux Voting System. All Rights Reserved.</small>
        </Container>
      </footer>
    </div>
  );
};

export default PollManager;




// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   fetchPolls,
//   createPoll,
//   updatePoll,
//   deletePoll,
//   togglePollStatus,
//   createPollOption,
//   updatePollOption,
//   deletePollOption,
// } from "../ApiCalls/api";
// import { Navbar, Container, Nav } from "react-bootstrap";

// const PollManager = () => {
//   const [polls, setPolls] = useState([]);
//   const [search, setSearch] = useState("");
//   const [editingPoll, setEditingPoll] = useState(null);
//   const [formData, setFormData] = useState({
//     poll_id: 0,
//     creator_id: "", // will come from auth later
//     title: "",
//     description: "",
//     start_time: "",
//     end_time: "",
//     is_active: true,
//     created_at: "",
//   });
//   const [newOption, setNewOption] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [viewAll, setViewAll] = useState(false);

//   const rowsPerPage = 8;

//   // Fetch polls
//   useEffect(() => {
//     loadPolls();
//   }, []);

//   const loadPolls = async () => {
//     try {
//       const res = await fetchPolls();
//       setPolls(res.data);
//     } catch (error) {
//       console.error("Error fetching polls:", error);
//     }
//   };

//   // Handle poll input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Create poll
//   const handleCreate = async (e) => {
//     e.preventDefault();
//     try {
//       await createPoll({
//         creator_id: formData.creator_id,
//         title: formData.title,
//         description: formData.description,
//         start_time: formData.start_time,
//         end_time: formData.end_time,
//         is_active: formData.is_active,
//       });

//       resetForm();
//       loadPolls();
//     } catch (error) {
//       console.error("Error creating poll:", error);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       poll_id: 0,
//       creator_id: "",
//       title: "",
//       description: "",
//       start_time: "",
//       end_time: "",
//       is_active: true,
//       created_at: "",
//     });
//     setNewOption("");
//   };

//   // Delete poll
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this poll?")) return;
//     try {
//       await deletePoll(id);
//       loadPolls();
//     } catch (error) {
//       console.error("Error deleting poll:", error);
//     }
//   };

//   // Edit poll
//   const handleEdit = (poll) => {
//     setEditingPoll(poll);
//     setFormData({
//       poll_id: poll.poll_id,
//       creator_id: poll.creator_id,
//       title: poll.title,
//       description: poll.description,
//       start_time: poll.start_time,
//       end_time: poll.end_time,
//       is_active: poll.is_active,
//       created_at: poll.created_at,
//     });
//     setShowModal(true);
//   };

//   // Update poll
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!editingPoll) return;

//     try {
//       await updatePoll(editingPoll.poll_id, {
//         title: formData.title,
//         description: formData.description,
//         start_time: formData.start_time,
//         end_time: formData.end_time,
//         is_active: formData.is_active,
//       });

//       setEditingPoll(null);
//       setShowModal(false);
//       resetForm();
//       loadPolls();
//     } catch (error) {
//       console.error("Error updating poll:", error);
//     }
//   };

//   // Toggle poll status
//   const handleToggleStatus = async (poll) => {
//     try {
//       await togglePollStatus(poll.poll_id, { is_active: !poll.is_active });
//       loadPolls();
//     } catch (err) {
//       console.error("Error toggling status:", err);
//     }
//   };

//   // Add option
//   const handleAddOption = async (pollId) => {
//     if (!newOption.trim()) return;
//     try {
//       await createPollOption({ poll_id: pollId, option_text: newOption });
//       setNewOption("");
//       loadPolls();
//     } catch (error) {
//       console.error("Error adding option:", error);
//     }
//   };

//   // Update option
//   const handleUpdateOption = async (optionId, newText) => {
//     try {
//       await updatePollOption(optionId, { option_text: newText });
//       loadPolls();
//     } catch (error) {
//       console.error("Error updating option:", error);
//     }
//   };

//   // Delete option
//   const handleDeleteOption = async (optionId) => {
//     if (!window.confirm("Delete this option?")) return;
//     try {
//       await deletePollOption(optionId);
//       loadPolls();
//     } catch (error) {
//       console.error("Error deleting option:", error);
//     }
//   };

//   // Filter polls
//   const filteredPolls = polls.filter(
//     (poll) =>
//       poll.title.toLowerCase().includes(search.toLowerCase()) ||
//       poll.description.toLowerCase().includes(search.toLowerCase())
//   );

//   // Pagination
//   const totalPages = Math.ceil(filteredPolls.length / rowsPerPage);
//   const paginatedPolls = viewAll
//     ? filteredPolls
//     : filteredPolls.slice(
//         (currentPage - 1) * rowsPerPage,
//         currentPage * rowsPerPage
//       );

//   return (
//     <div className="d-flex flex-column min-vh-100">
//       {/* Navbar */}
//       <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
//         <Container>
//           <Navbar.Brand href="#">⚡ Nesux Polls</Navbar.Brand>
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

//       <div className="container py-4">
//         {/* Create Poll Form */}
//         <div className="card mb-4 shadow">
//           <div className="card-body">
//             <h2 className="h5 fw-bold mb-3">Create Poll</h2>
//             <form onSubmit={handleCreate}>
//               <div className="mb-3">
//                 <input
//                   type="text"
//                   name="title"
//                   placeholder="Poll Title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   className="form-control"
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <textarea
//                   name="description"
//                   placeholder="Poll Description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   className="form-control"
//                 />
//               </div>
//               <div className="mb-3">
//                 <input
//                   type="datetime-local"
//                   name="start_time"
//                   value={formData.start_time}
//                   onChange={handleChange}
//                   className="form-control"
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <input
//                   type="datetime-local"
//                   name="end_time"
//                   value={formData.end_time}
//                   onChange={handleChange}
//                   className="form-control"
//                   required
//                 />
//               </div>
//               <button type="submit" className="btn btn-primary">
//                 Create Poll
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Polls Table */}
//         <div className="card shadow">
//           <div className="card-body">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h2 className="h5 fw-bold">Polls</h2>
//               <div className="d-flex gap-2">
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="form-control"
//                   style={{ maxWidth: "200px" }}
//                 />
//                 <button
//                   onClick={() => setViewAll(!viewAll)}
//                   className="btn btn-success"
//                 >
//                   {viewAll ? "Paginate" : "View All"}
//                 </button>
//               </div>
//             </div>

//             <table className="table table-bordered table-hover">
//               <thead className="table-light">
//                 <tr>
//                   <th>ID</th>
//                   <th>Title</th>
//                   <th>Description</th>
//                   <th>Options</th>
//                   <th>Start</th>
//                   <th>End</th>
//                   <th>Active</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedPolls.map((poll) => (
//                   <tr key={poll.poll_id}>
//                     <td>{poll.poll_id}</td>
//                     <td>{poll.title}</td>
//                     <td>
//                       {poll.description.length > 20
//                         ? poll.description.slice(0, 20) + "..."
//                         : poll.description}
//                     </td>
//                     <td>
//                       <ul className="list-unstyled">
//                         {poll.options?.map((opt) => (
//                           <li key={opt.option_id} className="d-flex align-items-center mb-1">
//                             <input
//                               type="text"
//                               defaultValue={opt.option_text}
//                               className="form-control form-control-sm me-2"
//                               onBlur={(e) =>
//                                 handleUpdateOption(opt.option_id, e.target.value)
//                               }
//                             />
//                             <button
//                               onClick={() => handleDeleteOption(opt.option_id)}
//                               className="btn btn-sm btn-danger"
//                             >
//                               ×
//                             </button>
//                           </li>
//                         ))}
//                         <li className="d-flex mt-2">
//                           <input
//                             type="text"
//                             placeholder="New option"
//                             value={newOption}
//                             onChange={(e) => setNewOption(e.target.value)}
//                             className="form-control form-control-sm me-2"
//                           />
//                           <button
//                             onClick={() => handleAddOption(poll.poll_id)}
//                             className="btn btn-sm btn-success"
//                           >
//                             +
//                           </button>
//                         </li>
//                       </ul>
//                     </td>
//                     <td>{new Date(poll.start_time).toLocaleString()}</td>
//                     <td>{new Date(poll.end_time).toLocaleString()}</td>
//                     <td>
//                       <span
//                         className={`badge ${
//                           poll.is_active ? "bg-success" : "bg-danger"
//                         }`}
//                       >
//                         {poll.is_active ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="d-flex gap-2">
//                       <button
//                         onClick={() => handleEdit(poll)}
//                         className="btn btn-warning btn-sm"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(poll.poll_id)}
//                         className="btn btn-danger btn-sm"
//                       >
//                         Delete
//                       </button>
//                       <button
//                         onClick={() => handleToggleStatus(poll)}
//                         className={`btn btn-sm ${
//                           poll.is_active ? "btn-secondary" : "btn-success"
//                         }`}
//                       >
//                         {poll.is_active ? "Deactivate" : "Activate"}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {filteredPolls.length === 0 && (
//                   <tr>
//                     <td colSpan={8} className="text-center text-muted py-3">
//                       No polls found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>

//             {!viewAll && totalPages > 1 && (
//               <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((prev) => prev - 1)}
//                   className="btn btn-outline-secondary btn-sm"
//                 >
//                   ← Prev
//                 </button>
//                 <span>
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage((prev) => prev + 1)}
//                   className="btn btn-outline-secondary btn-sm"
//                 >
//                   Next →
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <footer className="bg-primary text-white text-center py-3 mt-auto">
//         <Container>
//           <small>© 2025 Nesux Voting System. All Rights Reserved.</small>
//         </Container>
//       </footer>
//     </div>
//   );
// };

// export default PollManager;
