import { useState } from "react";
import { Button } from "../ui/button";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "../ui/navbar";
import { Card, CardContent } from "../ui/card";

// Badge Component
const Badge = ({ children, className = "" }) => {
  return (
    <span className={`px-3 py-1 text-sm font-semibold text-white rounded ${className}`}>
      {children}
    </span>
  );
};

export default function DeployedProjectsDashboard() {
  const [projects, setProjects] = useState([
    { id: 1, name: "E-Commerce API", status: "Running", url: "https://example.com/api", lastDeployed: "2024-02-15" },
    { id: 2, name: "AI Chatbot", status: "Stopped", url: "https://chatbot.example.com", lastDeployed: "2024-02-10" },
    { id: 3, name: "DevOps Pipeline", status: "Running", url: "https://devops.example.com", lastDeployed: "2024-02-05" },
  ]);

  const getStatusBadge = (status) => {
    return status === "Running" ? "bg-green-500" : "bg-red-500";
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar className="fixed top-0 left-0 right-0 bg-black/75 backdrop-blur-md shadow-md px-12 py-4 border border-white">
        <NavbarBrand className="text-3xl font-extrabold text-white">DevEase</NavbarBrand>
        <NavbarContent className="hidden md:flex space-x-6">
          <NavbarItem><a href="#dashboard" className="text-white hover:text-gray-300 text-lg">Dashboard</a></NavbarItem>
          <NavbarItem><a href="#projects" className="text-white hover:text-gray-300 text-lg">Projects</a></NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 text-center px-6 pt-24">
        <h1 className="text-5xl font-bold text-white">Deployed Projects</h1>
        <p className="mt-2 text-gray-400 text-lg">Manage and monitor your deployments</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {projects.map((project) => (
            <Card key={project.id} className="bg-gray-900 border border-white rounded-lg shadow-lg p-6">
              <CardContent>
                <h2 className="text-2xl font-semibold">{project.name}</h2>
                <p className="text-gray-400 text-sm">Last deployed: {project.lastDeployed}</p>
                <Badge className={`mt-2 ${getStatusBadge(project.status)}`}>{project.status}</Badge>
                <div className="mt-4 flex space-x-3">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">View Logs</Button>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg">Restart</Button>
                  <Button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
