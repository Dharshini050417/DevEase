import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import axios
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Navbar, NavbarBrand } from "../components/ui/navbar";
import ParticlesBackground from "../components/ui/ParticlesBackground/ParticlesBackground";


export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation: check if passwords match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      console.log("Signup successful");
      navigate("/login");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <>
      {/* Navbar */}
      <ParticlesBackground/>
      <Navbar className="fixed top-0 left-0 right-0 bg-black/75 backdrop-blur-md shadow-md px-12 py-4 flex justify-between items-center border border-white">
        <NavbarBrand className="text-3xl font-extrabold text-white">DevEase</NavbarBrand>
      </Navbar>

      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md bg-black border border-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white text-center">Sign Up</h2>
          
          {error && <p className="text-red-400 text-center mt-2">{error}</p>}
          
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border border-white bg-black text-white rounded-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border border-white bg-black text-white rounded-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border border-white bg-black text-white rounded-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border border-white bg-black text-white rounded-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-4 !bg-white !text-black px-4 py-2 rounded-none"
            >
              Sign Up
            </Button>

            {/* Login Link */}
            <p className="text-white text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
