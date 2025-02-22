import React, { useState, useEffect, useRef } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "../components/ui/navbar";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Mail } from "lucide-react"; // Import icons

export default function WholeNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch user details when the component mounts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || null;
    setUser(storedUser);
  }, []);

  // Toggle dropdown and update user details if not already set
  const toggleDropdown = () => {
    if (!dropdownOpen && !user) {
      const storedUser = JSON.parse(localStorage.getItem("user")) || null;
      setUser(storedUser);
    }
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    const token = localStorage.getItem("token"); // Get the token
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json(); // Get response JSON

      if (!response.ok) {
        console.error("Logout failed:", data);
        return;
      }

      console.log("Logout successful:", data);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage and redirect to login regardless of API response
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <Navbar className="fixed top-0 left-0 right-0 bg-black/75 backdrop-blur-md shadow-md px-12 py-4 flex justify-between items-center border border-white">
      {/* Brand */}
      <NavbarBrand className="text-3xl font-extrabold text-white">
        DevEase
      </NavbarBrand>

      {/* Navigation Links */}
      <NavbarContent className="hidden md:flex space-x-6">
        <NavbarItem>
          <Link
            to="/main"
            className="text-gray-500 text-sm transition-colors duration-150 ease-in-out hover:text-white"
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            to="/dashboard"
            className="text-gray-500 text-sm transition-colors duration-150 ease-in-out hover:text-white"
          >
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            to="/docs"
            className="text-gray-500 text-sm transition-colors duration-150 ease-in-out hover:text-white"
          >
            Docs
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Right Side (Button & Avatar) */}
      <NavbarContent className="flex items-center space-x-4 relative">
        <Link to="/form">
          <Button className="!bg-white rounded-lg hover:bg-gray-200 !text-black px-6 py-2 text-sm font-medium">
            Deploy
          </Button>
        </Link>

        {/* Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleDropdown}>
            <div
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-500 text-white font-bold text-lg border-2 border-white shadow-lg 
                            hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "G"}
            </div>
          </button>

          {dropdownOpen && user && (
            <div
              className="absolute right-0 mt-3 w-64 bg-white/20 backdrop-blur-xl shadow-lg rounded-lg p-5 border border-gray-300 
                          animate-fadeIn transform transition-all duration-300 ease-in-out"
            >
              <div className="flex flex-col items-center text-white">
                {/* Avatar */}
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-700 text-white text-xl font-bold shadow-md mb-3">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                {/* Name */}
                <p className="text-lg font-semibold">{user.name}</p>

                {/* Email */}
                <div className="flex items-center space-x-2 text-gray-300 mt-1">
                  <Mail size={16} />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>

              {/* Divider */}
              <hr className="my-4 border-gray-500" />

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left text-white font-medium px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 
                           transition-all shadow-md"
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </NavbarContent>
    </Navbar>
  );
}
