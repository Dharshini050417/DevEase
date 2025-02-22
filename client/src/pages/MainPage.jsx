import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { Avatar } from "../components/ui/avatar";
import WholeNavbar from "./WholeNavbar";
import { Link } from "react-router-dom";
import ParticlesBackground  from "../components/ui/ParticlesBackground/ParticlesBackground";

export default function DevEaseNavbar() {
  useEffect(() => {
    console.log("User data:", localStorage.getItem("user"));
  }, []); // Runs only once when the component mounts


  return (
    <div className="flex flex-col min-h-screen">

    <ParticlesBackground/>
          <WholeNavbar/>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 text-center px-6 pt-40">
      <h1 className="text-7xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
  Deploy Without DevOps
</h1>

<p 
  className="mt-6 text-gray-500 max-w-4xl" 
  style={{ color: "#888888", fontSize: "max(15px, min(2vw, 20px))" }}
>
  Automate <strong className="text-white">deployments</strong> seamlessly with <strong className="text-white">DevEase</strong>. Connect your repo, configure, and launch effortlessly.
</p>

        <Link to="/form">
        <Button className="mt-8 !bg-white hover:bg-gray-200 !text-black px-8 py-4 text-xl rounded-xl shadow-lg !w-60 !h-15">
          Get Started
        </Button>
        </Link>
      </main>
    </div>
  );
}
