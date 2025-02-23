import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Form from "./pages/Form";
import Dashboard from "./pages/Dashboard";
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <Router>
              <ToastContainer />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/form" element={<Form />} />
      </Routes>
    </Router>
  );
}

export default App;
