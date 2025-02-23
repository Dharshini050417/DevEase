import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import WholeNavbar from "./WholeNavbar";
import { Link } from "react-router-dom";

export default function DeployedProjectsDashboard() {
  const [projects, setProjects] = useState([]);
  const [deploymentDetails, setDeploymentDetails] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/project/user/${user.id}`
        );
        const data = await response.json();

        if (response.ok) {
          setProjects(data);
        } else {
          console.error("Error fetching projects:", data.error);
        }
      } catch (error) {
        console.error("Server error:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchDeploymentDetails = async () => {
      const details = {};
      for (const project of projects) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/pipeline/deployment/${project.id}`
          );
          const data = await response.json();

          if (response.ok) {
            details[project.id] = data;
          } else {
            details[project.id] = { error: data.error };
          }
        } catch (error) {
          details[project.id] = { error: "Server error" };
        }
      }
      setDeploymentDetails(details);
    };

    if (projects.length > 0) {
      fetchDeploymentDetails();
    }
  }, [projects]);

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy.");
      });
  };

  const getStatusBadge = (status) =>
    status === "Running" ? "bg-green-500" : "bg-red-500";

  return (
    <>
      <WholeNavbar />
      <div className="flex flex-col min-h-screen  text-white items-center">
        <header className="text-center py-10">
          <h1 className="text-5xl font-bold">Deployed Projects</h1>
          <p className="mt-2 text-gray-400 text-lg">
            Manage and monitor your deployments
          </p>
        </header>

        <main className="flex flex-wrap justify-center gap-6 px-6 w-full max-w-4xl">
          {projects.map((project) => {
            const details = deploymentDetails[project.id];

            return (

              <Card key={project.id} className="w-[48%] bg-gray-900 shadow-lg">
                      <ToastContainer />

                <CardContent className="flex flex-col space-y-4 p-6">
                  <h2 className="text-2xl font-semibold">{project.name}</h2>
                  <p className="text-gray-400 text-sm">
                    Last deployed: {project.lastDeployed}
                  </p>
                  <span
                    className={`px-3 py-1 text-sm text-white ${getStatusBadge(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>

                  {details && !details.error ? (
                    <>
                      <p className="text-gray-400 text-sm">
                        Instance IP: {details.instance_ip}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Status: {details.status}
                      </p>
                      <Button
                        className="!bg-white !text-black text-sm hover:bg-grey px-4 py-2"
                        onClick={() => copyToClipboard(details.instance_ip)}
                      >
                        Copy Link
                      </Button>
                    </>
                  ) : (
                    <p className="text-red-400 text-sm">
                      {details?.error || "Loading deployment details..."}
                    </p>
                  )}

                  <div className="flex space-x-3 mt-4">
                    <Button className="!bg-white !text-black text-sm hover:bg-grey px-4 py-2">
                      View Logs
                    </Button>
                    <Button className="!bg-white !text-black text-sm px-4 py-2">
                      Restart
                    </Button>
                    <Button className="!bg-white !text-black text-sm hover:bg-grey px-4 py-2">
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </main>
      </div>
    </>
  );
}
