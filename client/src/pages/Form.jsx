import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import WholeNavbar from "./WholeNavbar";
import { useNavigate } from "react-router-dom";
import ParticlesBackground from "../components/ui/ParticlesBackground/ParticlesBackground";
import { Link } from "react-router-dom";
export default function DevEaseNavbar() {
  const [fields, setFields] = useState([]);

  const [envFile, setEnvFile] = useState(null);

  const baseImages = ["node:18", "python:3.9", "golang:1.18", "nginx:latest", "ubuntu:20.04"];

  // Load fields from localStorage on mount
  useEffect(() => {
    console.log(localStorage.user);
    const savedFields = localStorage.getItem("fields");
    if (savedFields) {
      setFields(JSON.parse(savedFields));
    } else {
      setFields([{ id: 1, branch: "", rootDir: "", startCmd: "", endCmd: "", baseImage: "node:18", ports: "" }]);
    }
  }, []);

  // Save fields to localStorage whenever they change
  useEffect(() => {
    if (fields.length > 0) {
      localStorage.setItem("fields", JSON.stringify(fields));
    }
  }, [fields]);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".env")) {
      setEnvFile(file);
    } else {
      alert("Please upload a valid .env file");
    }
  };
  // Function to add a new set of input fields
  const addFieldSet = () => {
    setFields([...fields, { id: Date.now(), branch: "", rootDir: "", startCmd: "", endCmd: "", baseImage: "node:18", ports: ""}]);
  };

  // Function to remove a specific field set
  const removeFieldSet = (id) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
    localStorage.setItem("fields", JSON.stringify(updatedFields));
  };

  // Handle input change
  const handleChange = (id, field, value) => {
    const updatedFields = fields.map(f => f.id === id ? { ...f, [field]: value } : f);
    setFields(updatedFields);
    localStorage.setItem("fields", JSON.stringify(updatedFields));
  };

  const navigate = useNavigate(); // Correct way to use useNavigate

const handleSubmit = async (event) => {
  event.preventDefault();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  let envContent = "";
  if (envFile) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      envContent = e.target.result;

      const payload = {
        userId: user.id,
        repoUrl: event.target.repoUrl.value,
        branchName: fields.branch,
        services: fields.map(field => ({
          name: field.rootDir || "service",
          buildCommand: field.endCmd,
          runCommand: field.startCmd,
          baseImage: field.baseImage,
          port: field.ports,
          envVars: envContent  // Sending env file content
        }))
      };

      console.log(payload);
      
      // Navigate after processing
      navigate("/dashboard"); // Correct usage
    };

    reader.readAsText(envFile);

    // try {
    //   const response = await fetch("http:localhost:5000/api/pipeline/create", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(payload)
    //   });

    //   if (response.ok) {
    //     console.log("Data sent successfully");
    //   } else {
    //     console.error("Failed to send data");
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    // }

    // useNavigate("/dashboard");
  
  }
};

  

  return (
    <>
    <ParticlesBackground/>
          <WholeNavbar/>

    
    <div className="flex flex-col min-h-screen relative ">
      {/* Background Stripes */}
      <div className="absolute inset-0 bg-black bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_10%,transparent_10%),linear-gradient(rgba(255,255,255,0.1)_10%,transparent_10%)] bg-[size:200px_200px] opacity-20"></div>

    
      <main className="flex flex-col items-center justify-center flex-1 text-center px-6 pt-40 relative">
        <h1 className="text-7xl font-extrabold text-white leading-tight tracking-tight">
          Deploy Without DevOps
        </h1>
        <p className="mt-6 text-2xl text-gray-300 max-w-4xl">
          Automate deployments seamlessly with DevEase. Connect your repo, configure, and launch effortlessly.
        </p>

        {/* Form */}
        <div className="mt-10 w-full max-w-2xl bg-black border border-white p-6  shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Enter Your Repository Details</h2>

          <form onSubmit={handleSubmit}>
            {/* GitHub URL Input */}
            <div className="mb-6">
              <label className="block text-left text-white mb-2 text-lg">GitHub Repository URL</label>
              <input 
                type="url" 
                name= "repoUrl"
                placeholder="https://github.com/user/repo" 
                className="w-full px-4 py-2 text-white  border border-gray-400 bg-transparent placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                required 
              />
            </div>

            {/* Dynamic Field Groups */}
            {fields.map((field) => (
              <div className="flex flex-col space-y-4">
  <label htmlFor="branch" className="text-white text-lg font-medium">
    Enter Branch:
  </label>
  <input
    type="text"
    id="branch"
    name="branch"
    placeholder="Enter your branch"
    value={field.branch}
    onChange={(e) => handleChange(field.id, "branch", e.target.value)}
    className="px-4 py-2 rounded-md border border-gray-400 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
   <input
      type="text"
      placeholder="Root Directory"
      value={field.rootDir}
      onChange={(e) => handleChange(field.id, "rootDir", e.target.value)}
      className="flex-1 px-4 py-2 text-white border border-gray-400 bg-transparent"
    />

  <div className="flex space-x-4">
   
    <input
      type="text"
      placeholder="Start Command"
      value={field.startCmd}
      onChange={(e) => handleChange(field.id, "startCmd", e.target.value)}
      className="flex-1 px-4 py-2 text-white border border-gray-400 bg-transparent"
    />
    <input
      type="text"
      placeholder="Build Command"
      value={field.endCmd}
      onChange={(e) => handleChange(field.id, "endCmd", e.target.value)}
      className="flex-1 px-4 py-2 text-white border border-gray-400 bg-transparent"
    />
  </div>

  <Button
    type="button"
    onClick={() => removeFieldSet(field.id)}
    className="mt-2 !bg-white !text-black px-4 py-1"
  >
    - Remove
  </Button>
</div>

            ))}

            <Button type="button" onClick={addFieldSet} className="w-full mt-4 !bg-white !hover:bg-gray-200 !text-black px-4 py-2  shadow-lg">
              + Add More Fields
            </Button>
            <Link to="/dashboard">
            <Button type="submit" className="w-full mt-6 !bg-white hover:bg-gray-200 !text-black px-4 py-2 text-lg  shadow-lg">
            Submit 
            </Button>
            </Link>
            
            
          </form>
        </div>
      </main>
    </div>
    </>
  );
}
