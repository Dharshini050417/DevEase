import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '../components/ui/navbar';
import { Button } from '../components/ui/button';
import { Avatar } from '../components/ui/avatar';
import { Link } from 'react-router-dom';

export default function WholeNavbar() { 
  return (
    <Navbar className="fixed top-0 left-0 right-0 bg-black/75 backdrop-blur-md shadow-md px-12 py-4 flex justify-between items-center border border-white">
      {/* Brand */}
      <NavbarBrand className="text-3xl font-extrabold text-white">DevEase</NavbarBrand>

      {/* Navigation Links */}
      <NavbarContent className="hidden md:flex space-x-6">
        <NavbarItem>
          <Link 
            to="/" 
            className="text-gray-500 text-sm rounded-[2px] transition-colors duration-150 ease-in-out hover:text-white"
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            to="/dashboard" 
            className="text-gray-500 text-sm rounded-[2px] transition-colors duration-150 ease-in-out hover:text-white"
          >
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            to="/docs" 
            className="text-gray-500 text-sm rounded-[2px] transition-colors duration-150 ease-in-out hover:text-white"
          >
            Docs
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Right Side (Button & Avatar) */}
      <NavbarContent className="flex items-center space-x-4">
      <Link to="/login">
          <Button className="!bg-white rounded-lg hover:bg-gray-200 !text-black px-6 py-2 text-sm font-medium ">
            Login
          </Button>
        </Link>
        <Link to="/form">
          <Button className="!bg-white rounded-lg hover:bg-gray-200 !text-black px-6 py-2 text-sm font-medium">
            Deploy
          </Button>
        </Link>
        <Avatar className="w-10 h-10 bg-gray-700 rounded-full" />
      </NavbarContent>
    </Navbar>
  );
}
