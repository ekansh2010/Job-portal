// db.js - Database connection (MySQL example)
// Replace with MongoDB using mongoose if preferred

const mysql = require('mysql2');

// Configure your database credentials here
const db = mysql.createConnection({
  host:     'localhost',
  user:     'root',        // your MySQL username
  password: '',            // your MySQL password
  database: 'job_portal'  // create this database first
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    return;
  }
  console.log('Connected to MySQL database successfully!');
});

// Create tables if they don't exist
const createTables = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('jobseeker','recruiter','admin') DEFAULT 'jobseeker',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    type ENUM('Full-time','Part-time','Remote','Internship') DEFAULT 'Full-time',
    category VARCHAR(50),
    salary VARCHAR(80),
    description TEXT,
    requirements TEXT,
    posted_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    cover_letter TEXT,
    resume_path VARCHAR(255),
    status ENUM('pending','reviewed','accepted','rejected') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`;

// Run each statement
createTables.split(';').filter(s => s.trim()).forEach(sql => {
  db.query(sql, err => {
    if (err) console.error('Table creation error:', err.message);
  });
});

module.exports = db;
