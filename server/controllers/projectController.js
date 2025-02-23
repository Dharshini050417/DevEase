const supabase = require("../config/db");

// ✅ Add Project to Supabase
const addProject = async (req, res) => {
    const { userId, repoUrl, branchName, services } = req.body;

    if (!userId || !repoUrl || !branchName || !services) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const { data, error } = await supabase
            .from("projects")
            .insert([{ 
                user_id: userId.trim(), 
                repo_url: repoUrl.trim(), 
                branch_name: branchName.trim(), 
                services 
            }])
            .select("*");

        if (error) return res.status(400).json({ error: error.message });

        res.status(201).json({ message: "Project added successfully!", project: data });

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ Fetch All Projects for a User
const getProjects = async (req, res) => {
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ error: "User ID is required." });

    try {
        const { data, error } = await supabase
            .from("projects")
            .select("id, repo_url, branch_name, services, created_at")
            .eq("user_id", userId.trim());

        if (error) return res.status(400).json({ error: error.message });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ Get Deployment Details for a Specific Project
const getDeploymentDetails = async (req, res) => {
    const { projectId } = req.params;

    if (!projectId) return res.status(400).json({ error: "Project ID is required." });

    try {
        const { data, error } = await supabase
            .from("pipelines")
            .select("instance_ip, docker_output, status")
            .eq("project_id", projectId.trim())
            .order("created_at", { ascending: false })
            .limit(1);

        if (error) return res.status(400).json({ error: error.message });
        if (!data.length) return res.status(404).json({ error: "No deployment found for this project." });

        res.json(data[0]);

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { addProject, getProjects, getDeploymentDetails };
