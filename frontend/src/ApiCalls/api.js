import axios from "axios";

// Base URL of your backend (adjust for local or deployed server)
const API_BASE = "http://localhost:8000/api/";
const WS_BASE = "ws://localhost:8000/ws/"; 

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: add access token
api.interceptors.request.use(
  (config) => {
    const accessToken =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken =
          localStorage.getItem("refresh_token") ||
          sessionStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token available");

        // Request a new access token
        const res = await axios.post(`${API_BASE}auth/refresh/`, {
          refresh: refreshToken,
        });

        // Save new access token (wherever refresh token was stored)
        if (localStorage.getItem("refresh_token")) {
          localStorage.setItem("access_token", res.data.access);
        } else {
          sessionStorage.setItem("access_token", res.data.access);
        }

        // Retry original request
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Token refresh failed", err);
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

//
// ===== REST API Functions =====
//

// Fetch all polls
export const fetchPolls = () => api.get("polls/");

// Fetch a single poll by ID
export const fetchPoll = (pollId) => api.get(`polls/${pollId}/`);

export const createPoll = (data) => api.post("polls/", data);
export const updatePoll = (pollId, data) => api.put(`polls/${pollId}/`, data);
export const deletePoll = (pollId) => api.delete(`polls/${pollId}/`);
export const togglePollStatus = (pollId, data) =>api.patch(`polls/${pollId}/`, data);

// ✅ Poll Options API Calls
export const createPollOption = (data) => api.post("poll-options/", data);
export const updatePollOption = (optionId, data) => api.put(`poll-options/${optionId}/`, data);
export const deletePollOption = (optionId) => api.delete(`poll-options/${optionId}/`);

export const fetchUsers = () => api.get("users/");
export const createUser = (data) => api.post("users/", data);
export const updateUser = (userId, data) => api.put(`users/${userId}/`, data);
export const deleteUser = (userId) => api.delete(`users/${userId}/`);


// Submit a vote
export const submitVote = (voteData) => api.post("votes/", voteData);


export const fetchActivePoll = () => api.get("polls/active/");


// Login
export const loginUser = async (username, password) => {
  return await api.post("auth/login/", { username, password });
};

// Logout
export const logoutUser = async (token) => {
  return await api.post("auth/logout/", { token });
};

// Refresh access token
export const refreshToken = async (refresh) => {
  return await api.post("auth/refresh/", { refresh });
};

// Fetch voting history for logged-in user
export const fetchUserVoteHistory = () => api.get("votes/users/me/votes/");

// Fetch poll results (snapshot)
export const fetchPollResults = (pollId) =>
  api.get(`votes/polls/${pollId}/results/`);
// ApiCalls/api.js
export const fetchAdminPolls = () => api.get("votes/polls/admin/");


//
// ===== WebSocket Functions =====
//

// Connect to WebSocket for live poll results
export const connectToPollResults = (pollId, onMessage) => {
  const socket = new WebSocket(`${WS_BASE}votes/${pollId}/`);

  socket.onopen = () => {
    console.log(`✅ Connected to poll ${pollId} WebSocket`);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data); // callback to update React state
    } catch (err) {
      console.error("Error parsing WebSocket message", err);
    }
  };

  socket.onclose = () => {
    console.log(`❌ Disconnected from poll ${pollId} WebSocket`);
  };

  socket.onerror = (err) => {
    console.error("WebSocket error", err);
  };

  return socket; // caller must close it on unmount
};
