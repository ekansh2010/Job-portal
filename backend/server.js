// server.js - Node.js Express Backend (Optional)
// Run: npm install && node server.js

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));  // serve frontend

// =============================================
// In-memory data (replace with MySQL/MongoDB)
// =============================================
let jobs  = [
  { id: 1, title: "Frontend Developer",  company: "TechCorp", location: "Bangalore", type: "Full-time", salary: "8-12 LPA", category: "Technology" },
  { id: 2, title: "UI/UX Designer",      company: "Creative Studio", location: "Mumbai", type: "Remote",     salary: "6-10 LPA", category: "Design" }
];
let users = [];
let applications = [];

// =============================================
// ROUTES – Jobs
// =============================================
app.get('/api/jobs', (req, res) => {
  const { search, type, location, category } = req.query;
  let result = [...jobs];

  if (search)   result = result.filter(j => j.title.toLowerCase().includes(search.toLowerCase()));
  if (type)     result = result.filter(j => j.type === type);
  if (location) result = result.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
  if (category) result = result.filter(j => j.category === category);

  res.json({ success: true, count: result.length, jobs: result });
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id == req.params.id);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  res.json({ success: true, job });
});

app.post('/api/jobs', (req, res) => {
  const { title, company, location, type, salary, description, category } = req.body;
  if (!title || !company) return res.status(400).json({ success: false, message: 'Title and company are required' });

  const newJob = { id: Date.now(), title, company, location, type, salary, description, category, postedAt: new Date() };
  jobs.push(newJob);
  res.status(201).json({ success: true, job: newJob });
});

app.delete('/api/jobs/:id', (req, res) => {
  const before = jobs.length;
  jobs = jobs.filter(j => j.id != req.params.id);
  if (jobs.length === before) return res.status(404).json({ success: false, message: 'Job not found' });
  res.json({ success: true, message: 'Job deleted' });
});

// =============================================
// ROUTES – Auth
// =============================================
app.post('/api/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });

  const exists = users.find(u => u.email === email);
  if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

  // NOTE: In production, use bcrypt to hash passwords!
  const user = { id: Date.now(), name, email, password, role: role || 'jobseeker' };
  users.push(user);

  const { password: _, ...safeUser } = user;
  res.status(201).json({ success: true, user: safeUser });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser, token: `token_${user.id}` });
});

// =============================================
// ROUTES – Applications
// =============================================
app.post('/api/apply', (req, res) => {
  const { jobId, userId, userName, userEmail } = req.body;
  const job = jobs.find(j => j.id == jobId);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

  const app2 = { id: Date.now(), jobId, jobTitle: job.title, company: job.company, userId, userName, userEmail, appliedAt: new Date(), status: 'pending' };
  applications.push(app2);
  res.status(201).json({ success: true, application: app2 });
});

app.get('/api/applications', (req, res) => {
  res.json({ success: true, count: applications.length, applications });
});

// =============================================
// Start server
// =============================================
app.listen(PORT, () => {
  console.log(`JobPortal server running at http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/jobs`);
});
