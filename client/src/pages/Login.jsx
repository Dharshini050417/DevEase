import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Navbar, NavbarBrand } from "../components/ui/navbar";
import { Link } from "react-router-dom";
import ParticlesBackground from "../components/ui/ParticlesBackground/ParticlesBackground";
export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      localStorage.removeItem("user"); // Clear existing user data
      localStorage.setItem("token", res.data.token); // Store token in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user)); // Store user data
      navigate("/main"); // Redirect after successful login
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ParticlesBackground />
      <Navbar className="fixed top-0 left-0 right-0 bg-black/75 backdrop-blur-md shadow-md px-12 py-4 flex justify-between items-center border border-white">
        <NavbarBrand className="text-3xl font-extrabold text-white">
          DevEase
        </NavbarBrand>
      </Navbar>

      <div className="flex flex-1 items-center justify-center px-6 pt-32">
        <div className="w-full max-w-md bg-black border border-white p-8 shadow-lg">
          <h2 className="text-3xl font-semibold text-white mb-6 text-center">
            Login
          </h2>

          {error && <p className="text-red-400 text-center mt-2">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white mb-2 text-lg">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 text-white border border-gray-400 bg-transparent placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2 text-lg">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 text-white border border-gray-400 bg-transparent placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full !bg-white hover:bg-gray-200 !text-black px-4 py-2 text-lg shadow-lg"
            >
              Login
            </Button>

            <p className="text-white text-center mt-4">
              New User?{" "}
              <Link
                to="/signup"
                className="text-blue-400 underline hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
