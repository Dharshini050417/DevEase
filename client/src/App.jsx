import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainPage  from "./pages/MainPage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Form from "./pages/Form"
import Dashboard from "./pages/Dashboard"

function App() {

  return (
    <Router>
      <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element ={<Signup/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/form" element={<Form/>}/>
      </Routes>
    </Router>
  );
}

export default App
