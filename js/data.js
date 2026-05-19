// ===========================
// data.js – Job & User Data
// JobHunt Minor Project
// ===========================

const jobsData = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova Solutions",
    logo: "TN",
    location: "Bengaluru, India",
    type: "Full-Time",
    category: "Technology",
    salary: "₹8–12 LPA",
    experience: "1–3 years",
    skills: ["HTML", "CSS", "React", "JavaScript"],
    posted: "2 days ago",
    description: "We are looking for a talented Frontend Developer to join our growing team. You will be responsible for building user-facing features using React.js.",
    remote: false
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Pixel Perfect Studio",
    logo: "PP",
    location: "Remote",
    type: "Remote",
    category: "Design",
    salary: "₹6–10 LPA",
    experience: "2+ years",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    posted: "1 day ago",
    description: "Join our design team to create beautiful and intuitive user interfaces for our clients worldwide.",
    remote: true
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "CloudBase Inc.",
    logo: "CB",
    location: "Hyderabad, India",
    type: "Full-Time",
    category: "Technology",
    salary: "₹12–18 LPA",
    experience: "3–5 years",
    skills: ["Node.js", "MongoDB", "REST API", "AWS"],
    posted: "3 days ago",
    description: "Looking for a skilled backend developer to design scalable APIs and manage cloud infrastructure.",
    remote: false
  },
  {
    id: 4,
    title: "Digital Marketing Intern",
    company: "GrowthHive",
    logo: "GH",
    location: "Delhi, India",
    type: "Internship",
    category: "Marketing",
    salary: "₹8,000–15,000/mo",
    experience: "Fresher",
    skills: ["SEO", "Social Media", "Content Writing"],
    posted: "Today",
    description: "Great opportunity for freshers to learn digital marketing from industry experts.",
    remote: false
  },
  {
    id: 5,
    title: "Data Scientist",
    company: "InsightAI Labs",
    logo: "IA",
    location: "Pune, India",
    type: "Full-Time",
    category: "Technology",
    salary: "₹14–22 LPA",
    experience: "2–4 years",
    skills: ["Python", "ML", "TensorFlow", "SQL"],
    posted: "5 days ago",
    description: "Join our data science team to build machine learning models and derive insights from large datasets.",
    remote: false
  },
  {
    id: 6,
    title: "Content Writer",
    company: "WordCraft Media",
    logo: "WC",
    location: "Remote",
    type: "Part-Time",
    category: "Marketing",
    salary: "₹25,000–40,000/mo",
    experience: "1+ year",
    skills: ["Writing", "SEO", "Research"],
    posted: "1 week ago",
    description: "We need creative content writers to produce engaging articles, blogs, and social media posts.",
    remote: true
  },
  {
    id: 7,
    title: "Financial Analyst",
    company: "Horizon Capital",
    logo: "HC",
    location: "Mumbai, India",
    type: "Full-Time",
    category: "Finance",
    salary: "₹10–16 LPA",
    experience: "2–3 years",
    skills: ["Excel", "Financial Modelling", "Accounting"],
    posted: "4 days ago",
    description: "Seeking an analyst to support investment decisions with data-driven financial analysis.",
    remote: false
  },
  {
    id: 8,
    title: "Full Stack Developer",
    company: "Startup Nexus",
    logo: "SN",
    location: "Remote",
    type: "Remote",
    category: "Technology",
    salary: "₹10–16 LPA",
    experience: "2+ years",
    skills: ["React", "Node.js", "MongoDB", "Docker"],
    posted: "Today",
    description: "Be part of an exciting startup and help build the next big product from the ground up.",
    remote: true
  },
  {
    id: 9,
    title: "HR Executive",
    company: "PeopleFirst HR",
    logo: "PF",
    location: "Chennai, India",
    type: "Full-Time",
    category: "Education",
    salary: "₹4–7 LPA",
    experience: "0–2 years",
    skills: ["Recruitment", "Communication", "MS Office"],
    posted: "2 days ago",
    description: "Help us find and retain the best talent. You will manage end-to-end recruitment processes.",
    remote: false
  },
  {
    id: 10,
    title: "Graphic Designer",
    company: "CreativeBlast",
    logo: "CB",
    location: "Noida, India",
    type: "Full-Time",
    category: "Design",
    salary: "₹5–8 LPA",
    experience: "1–2 years",
    skills: ["Photoshop", "Illustrator", "Canva"],
    posted: "6 days ago",
    description: "We are looking for a creative graphic designer to support our marketing and branding efforts.",
    remote: false
  }
];

// Simulated users stored in localStorage
function getUsers() {
  const raw = localStorage.getItem("jh_users");
  return raw ? JSON.parse(raw) : [];
}

function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("jh_users", JSON.stringify(users));
}

function getLoggedInUser() {
  const raw = localStorage.getItem("jh_current_user");
  return raw ? JSON.parse(raw) : null;
}

function loginUser(user) {
  localStorage.setItem("jh_current_user", JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem("jh_current_user");
}

function getApplications() {
  const raw = localStorage.getItem("jh_applications");
  return raw ? JSON.parse(raw) : [];
}

function saveApplication(app) {
  const apps = getApplications();
  apps.push(app);
  localStorage.setItem("jh_applications", JSON.stringify(apps));
}

function typeLabel(type) {
  const map = {
    "Full-Time": "full-time",
    "Part-Time": "part-time",
    "Remote": "remote",
    "Internship": "internship"
  };
  return map[type] || "full-time";
}

function createJobCard(job) {
  return `
    <div class="job-card" onclick="openJobDetail(${job.id})">
      <div class="card-top">
        <div class="company-logo">${job.logo}</div>
        <span class="job-type ${typeLabel(job.type)}">${job.type}</span>
      </div>
      <div class="job-title">${job.title}</div>
      <div class="company-name">${job.company}</div>
      <div class="job-meta">
        <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
        <span><i class="fas fa-clock"></i> ${job.experience}</span>
      </div>
      <div class="job-salary">${job.salary}</div>
      <div class="card-footer">
        <span class="posted-date">Posted ${job.posted}</span>
        <button class="apply-btn" onclick="event.stopPropagation(); applyJob(${job.id})">Apply Now</button>
      </div>
    </div>
  `;
}

function createJobListCard(job) {
  return `
    <div class="job-list-card" onclick="openJobDetail(${job.id})">
      <div class="company-logo" style="flex-shrink:0">${job.logo}</div>
      <div class="job-list-info">
        <div class="job-list-title">${job.title}</div>
        <div class="job-list-company">${job.company}</div>
        <div class="job-list-meta">
          <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
          <span><i class="fas fa-briefcase"></i> ${job.experience}</span>
          <span><i class="fas fa-tag"></i> ${job.category}</span>
        </div>
      </div>
      <div class="job-list-right">
        <div class="job-list-salary">${job.salary}</div>
        <span class="job-type ${typeLabel(job.type)}">${job.type}</span>
        <br/><br/>
        <button class="apply-btn" onclick="event.stopPropagation(); applyJob(${job.id})">Apply</button>
      </div>
    </div>
  `;
}
