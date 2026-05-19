// main.js - General utility functions for Job Portal

// Sample job data (in real project this comes from database/API)
const sampleJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp Solutions",
    logo: "💻",
    location: "Bangalore, India",
    type: "Full-time",
    salary: "₹8L – ₹12L/year",
    description: "We are looking for a skilled Frontend Developer to join our growing team. You will be responsible for building and maintaining web applications using React.js and modern CSS frameworks.",
    requirements: ["2+ years experience", "React.js", "CSS/SCSS", "REST APIs", "Git"],
    posted: "2 days ago",
    category: "Technology"
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Creative Studio",
    logo: "🎨",
    location: "Mumbai, India",
    type: "Remote",
    salary: "₹6L – ₹10L/year",
    description: "Join our creative team to design intuitive user interfaces and engaging experiences for our clients across various industries.",
    requirements: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    posted: "1 day ago",
    category: "Design"
  },
  {
    id: 3,
    title: "Data Analyst Intern",
    company: "Analytics Hub",
    logo: "📊",
    location: "Hyderabad, India",
    type: "Internship",
    salary: "₹15,000/month",
    description: "Great opportunity for students to gain hands-on experience in data analytics using Python, SQL, and visualization tools.",
    requirements: ["Python basics", "SQL", "Excel", "Analytical thinking"],
    posted: "3 days ago",
    category: "Data Science"
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "StartupXYZ",
    logo: "⚙️",
    location: "Pune, India",
    type: "Full-time",
    salary: "₹10L – ₹18L/year",
    description: "Looking for a Node.js backend developer to build scalable APIs and manage database architecture for our growing platform.",
    requirements: ["Node.js", "MongoDB", "Express.js", "3+ years exp"],
    posted: "5 days ago",
    category: "Technology"
  },
  {
    id: 5,
    title: "Digital Marketing Executive",
    company: "GrowthMakers",
    logo: "📣",
    location: "Delhi, India",
    type: "Part-time",
    salary: "₹25,000/month",
    description: "Drive our digital presence through SEO, social media management, content creation, and paid advertising campaigns.",
    requirements: ["SEO/SEM", "Social Media", "Google Ads", "Analytics"],
    posted: "1 week ago",
    category: "Marketing"
  },
  {
    id: 6,
    title: "Business Development Manager",
    company: "SalesForce India",
    logo: "💼",
    location: "Chennai, India",
    type: "Full-time",
    salary: "₹12L – ₹20L/year",
    description: "Lead business development initiatives, identify new opportunities, and build strategic partnerships to drive company growth.",
    requirements: ["5+ years experience", "B2B Sales", "CRM tools", "Communication"],
    posted: "4 days ago",
    category: "Business"
  }
];

// Load jobs into localStorage if not already there
function initJobs() {
  const existing = localStorage.getItem('jobPortal_jobs');
  if (!existing) {
    localStorage.setItem('jobPortal_jobs', JSON.stringify(sampleJobs));
  }
}

// Get all jobs
function getAllJobs() {
  initJobs();
  return JSON.parse(localStorage.getItem('jobPortal_jobs')) || [];
}

// Add a new job
function addJob(jobData) {
  const jobs = getAllJobs();
  const newJob = {
    id: Date.now(),
    ...jobData,
    posted: "Just now"
  };
  jobs.unshift(newJob);
  localStorage.setItem('jobPortal_jobs', JSON.stringify(jobs));
  return newJob;
}

// Get job by ID
function getJobById(id) {
  const jobs = getAllJobs();
  return jobs.find(j => j.id == id);
}

// Get badge class based on job type
function getBadgeClass(type) {
  const map = {
    "Full-time": "badge-fulltime",
    "Part-time": "badge-parttime",
    "Remote": "badge-remote",
    "Internship": "badge-internship"
  };
  return map[type] || "badge-fulltime";
}

// Build a job card HTML
function buildJobCard(job) {
  return `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="job-card" onclick="window.location.href='pages/job-detail.html?id=${job.id}'">
        <div class="company-logo">${job.logo}</div>
        <div class="job-title">${job.title}</div>
        <div class="company-name">🏢 ${job.company}</div>
        <span class="badge-type ${getBadgeClass(job.type)}">${job.type}</span>
        <div class="job-location">📍 ${job.location}</div>
        <div class="job-salary">${job.salary}</div>
        <a href="pages/job-detail.html?id=${job.id}" class="apply-btn">View & Apply</a>
      </div>
    </div>
  `;
}

// Show toast notification
function showToast(message, type = 'success') {
  const existing = document.getElementById('toast-notif');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast-notif';
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: ${type === 'success' ? '#22c55e' : '#ef4444'};
    color: white; padding: 14px 22px; border-radius: 10px;
    font-family: Poppins, sans-serif; font-size: 0.9rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease;
  `;
  toast.innerHTML = message;

  const style = document.createElement('style');
  style.textContent = '@keyframes slideIn { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }';
  document.head.appendChild(style);

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('jobPortal_currentUser') !== null;
}

// Get current user
function getCurrentUser() {
  const u = localStorage.getItem('jobPortal_currentUser');
  return u ? JSON.parse(u) : null;
}

// Logout
function logout() {
  localStorage.removeItem('jobPortal_currentUser');
  window.location.href = '../index.html';
}

// Update navbar based on login state
function updateNavbar() {
  const user = getCurrentUser();
  const navActions = document.getElementById('nav-actions');
  if (!navActions) return;

  if (user) {
    navActions.innerHTML = `
      <li class="nav-item"><span class="nav-link">👋 ${user.name.split(' ')[0]}</span></li>
      <li class="nav-item"><a class="nav-link btn-nav-login ms-2" href="#" onclick="logout()">Logout</a></li>
    `;
  }
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
  initJobs();
  updateNavbar();
});
