![IMG-20250223-WA0016](https://github.com/user-attachments/assets/9ab23a60-40d8-4ce8-9292-52ef48e59e4d)# DevEase – Deploy Without DevOps

DevEase is a no-code CI/CD and hosting platform designed to automate deployment for developers without DevOps expertise. By providing a Git repository, branch name, root directory, and build instructions, users can set up a fully automated pipeline powered by Jenkins and Terraform. The platform supports deployment on the cloud, offering both containerized and VM-based hosting with a static project URL for continuous deployment.

## DEMO LINK - [link](https://youtu.be/fzLkbwkgMPo?si=4z-24DzjQR53U_TT)

## 🚀 Key Features

- *Automated CI/CD Pipeline* – Users provide project details, and a Jenkins pipeline is generated.
- *Continuous Integration & Deployment* – Every code push triggers build, test, and deployment.
- *Infrastructure as Code (IaC)* – Terraform provisions cloud infrastructure effortlessly.
- *Multi-Cloud Support* – Deploy seamlessly on Cloud Servers.
- *Static Hosting URL* – Each project gets a dedicated, unchanging deployment URL.
- *Containerized or VM-Based Deployment* – Supports Docker, Kubernetes, and VMs.
- *User-Friendly Web UI* – No YAML, scripting, or manual configuration required.

## 📌 Workflow

1. *User Submits Repository & Preferences* – Provides GitHub/GitLab repo, cloud provider, and build commands.
![IMG-20250223-WA0018](https://github.com/user-attachments/assets/0a6cd211-d5d2-499d-a80b-14e9553960f4)
2. *Pipeline Setup* – Automatically creates a Jenkins pipeline.
![WhatsApp Image 2025-02-23 at 17 55 51_415ea0c3](https://github.com/user-attachments/assets/71787c86-42f9-43de-8017-333310e942c1)
3. *Build* – The code is built.
![IMG-20250223-WA0016](https://github.com/user-attachments/assets/89f26549-6b66-4d9b-ba33-32d2d978247f)
4. *Provisioning & Deployment:*
    - Terraform provisions infrastructure on the cloud.
![IMG-20250223-WA0017](https://github.com/user-attachments/assets/5d682985-f981-401c-8a86-12eb5bcd8278)
![IMG-20250223-WA0020](https://github.com/user-attachments/assets/c3dd3f07-7eec-42ea-80c5-f95803fd1172)
5. *Continuous Updates* – Every new commit triggers the CI/CD pipeline and redeployment.
![WhatsApp Image 2025-02-23 at 17 59 14_189e6fcc](https://github.com/user-attachments/assets/6b56edf3-6f7c-437e-9d77-a85a6f872c4d)
![WhatsApp Image 2025-02-23 at 18 22 11_b0329a45](https://github.com/user-attachments/assets/29454152-fe42-4ab9-9a4f-9383db0554c7)

## 🎯 Target Users

- *🚀 Solo Developers & Startups* – Simplifies cloud hosting without DevOps knowledge.
- *🏢 Companies & Teams* – Automates deployment pipelines for improved efficiency.
- *🎓 Students & Hackathons* – Enables quick project deployment for showcasing work.
- *🛠️ Freelancers* – Simplifies sharing client projects with manageable hosting.

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS

### Backend
- Express.js (Node.js)

### CI/CD Automation
- Jenkins

### Infrastructure as Code (IaC)
- Terraform

### Cloud Hosting
- Containers

### Containerization
- Docker

## 🔑 How DevEase is Different?

✅ *Fully Automated CI/CD & Infrastructure* – Unlike GitHub Actions & GitLab CI, no manual scripting required.  
✅ *Cloud Agnostic* – Unlike Vercel or Netlify, which focus on frontend hosting.  
✅ *Integrates Jenkins and Terraform* – No other platform offers all these tools together.  
✅ *Dedicated Static URL for Each Project* – Ensuring stability in deployments.

## 👥 Team Members

- [*Dharshini G.A*](https://github.com/Dharshini050417)
- [*Mathew Melritchie S.*](https://github.com/matthew010505)
- [*M D Aravind*](https://github.com/mdaravind123)
- [*M A Reno*](https://github.com/reno4705)

## 🎯 How to Use DevEase?

1. *Login/Signup* – Create an account on DevEase.
2. *Enter Repository Details* – Provide repository URL, branch name, root directory, start command, and build command.
3. *Deploy* – DevEase will automatically generate Jenkins pipelines, provision infrastructure, and deploy your application.

## 🛠 Installation Steps

### *Frontend Setup*

1. Clone the repository:
   bash
   git clone https://github.com/Dharshini050417/DevEase
   
2. Navigate to the client directory:
   bash
   cd DevEase/client
   
3. Install dependencies:
   bash
   npm install
   
4. Start the frontend server:
   bash
   npm run dev
   

This will start the frontend at http://localhost:5173 (default Vite port).

### *Backend Setup*

1. Navigate to the server directory:
   bash
   cd DevEase/server
   
2. Install dependencies:
   bash
   npm install
   
3. Start the backend server:
   bash
   npm run dev
   

This will start the backend server at http://localhost:5000 (default Express.js port).

## 📢 Hackathon Participation

This project is being developed as part of a *FOSS Hackathon*, where we aim to make DevOps methodology seamless and accessible for all developers. Our mission is to empower developers with a hassle-free deployment experience without requiring DevOps expertise.

---

*Follow the progress of DevEase and contribute to open-source development!*
