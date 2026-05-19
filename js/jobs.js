// jobs.js - Job listing, search and filter logic

let allJobs = [];
let filteredJobs = [];

// Render job cards to container
function renderJobs(jobs) {
  const container = document.getElementById('jobsContainer');
  const countEl   = document.getElementById('jobCount');

  if (!container) return;

  if (jobs.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div style="font-size:3rem;">🔍</div>
        <h5 class="mt-3">No jobs found</h5>
        <p class="text-muted">Try adjusting your search filters</p>
      </div>
    `;
    if (countEl) countEl.textContent = '0 Jobs Found';
    return;
  }

  container.innerHTML = jobs.map(job => buildJobCard(job)).join('');
  if (countEl) countEl.textContent = `${jobs.length} Job${jobs.length > 1 ? 's' : ''} Found`;
}

// Apply search + filters
function applyFilters() {
  const query    = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const location = (document.getElementById('filterLocation')?.value || '').toLowerCase();
  const type     = document.getElementById('filterType')?.value || '';
  const category = document.getElementById('filterCategory')?.value || '';

  filteredJobs = allJobs.filter(job => {
    const matchQuery    = !query    || job.title.toLowerCase().includes(query) || job.company.toLowerCase().includes(query);
    const matchLocation = !location || job.location.toLowerCase().includes(location);
    const matchType     = !type     || job.type === type;
    const matchCategory = !category || job.category === category;
    return matchQuery && matchLocation && matchType && matchCategory;
  });

  renderJobs(filteredJobs);
}

// Sort jobs
function sortJobs(criteria) {
  if (criteria === 'newest') {
    filteredJobs.sort((a, b) => b.id - a.id);
  } else if (criteria === 'oldest') {
    filteredJobs.sort((a, b) => a.id - b.id);
  }
  renderJobs(filteredJobs);
}

// Init jobs page
function initJobsPage() {
  allJobs = getAllJobs();
  filteredJobs = [...allJobs];
  renderJobs(filteredJobs);

  // Attach event listeners
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  const filterEls = ['filterLocation', 'filterType', 'filterCategory'];
  filterEls.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', applyFilters);
  });

  const sortEl = document.getElementById('sortBy');
  if (sortEl) {
    sortEl.addEventListener('change', () => sortJobs(sortEl.value));
  }

  // Clear filters button
  const clearBtn = document.getElementById('clearFilters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      ['searchInput', 'filterLocation', 'filterType', 'filterCategory'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      filteredJobs = [...allJobs];
      renderJobs(filteredJobs);
    });
  }
}

// Load job detail page
function initJobDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const jobId  = params.get('id');

  if (!jobId) {
    window.location.href = 'jobs.html';
    return;
  }

  const job = getJobById(jobId);
  if (!job) {
    document.getElementById('jobDetailContainer').innerHTML = '<div class="alert alert-danger">Job not found.</div>';
    return;
  }

  document.title = `${job.title} – Job Portal`;

  document.getElementById('jobDetailContainer').innerHTML = `
    <div class="job-card" style="cursor:default;">
      <div class="d-flex align-items-center gap-3 mb-4">
        <div class="company-logo" style="width:64px;height:64px;font-size:2rem;">${job.logo}</div>
        <div>
          <h2 style="font-size:1.5rem;font-weight:700;">${job.title}</h2>
          <p class="text-muted mb-0">🏢 ${job.company} &nbsp;|&nbsp; 📍 ${job.location}</p>
        </div>
      </div>
      <div class="mb-3">
        <span class="badge-type ${getBadgeClass(job.type)} me-2">${job.type}</span>
        <span class="badge-type badge-fulltime">${job.category}</span>
      </div>
      <hr>
      <h5 class="mt-3 mb-2">Job Description</h5>
      <p>${job.description}</p>
      <h5 class="mt-4 mb-2">Requirements</h5>
      <ul>
        ${(job.requirements || []).map(r => `<li>${r}</li>`).join('')}
      </ul>
      <h5 class="mt-4 mb-2">Salary</h5>
      <p style="color:var(--primary);font-weight:600;">${job.salary}</p>
      <p class="text-muted" style="font-size:0.85rem;">Posted: ${job.posted}</p>
    </div>
  `;

  // Apply form handler
  const applyForm = document.getElementById('applyForm');
  if (applyForm) {
    applyForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const user = getCurrentUser();
      if (!user) {
        showToast('⚠️ Please login to apply for jobs.', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
      }

      // Save application to localStorage
      const apps = JSON.parse(localStorage.getItem('jobPortal_applications') || '[]');
      apps.push({
        jobId:     job.id,
        jobTitle:  job.title,
        company:   job.company,
        userId:    user.id,
        userName:  user.name,
        userEmail: user.email,
        appliedAt: new Date().toLocaleDateString()
      });
      localStorage.setItem('jobPortal_applications', JSON.stringify(apps));

      document.getElementById('applyForm').style.display = 'none';
      document.getElementById('applySuccess').style.display = 'block';
    });
  }
}

// Post job form handler
function initPostJobPage() {
  const form = document.getElementById('postJobForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const jobData = {
      title:       document.getElementById('jobTitle').value,
      company:     document.getElementById('companyName').value,
      logo:        document.getElementById('companyEmoji').value || '🏢',
      location:    document.getElementById('jobLocation').value,
      type:        document.getElementById('jobType').value,
      salary:      document.getElementById('jobSalary').value,
      category:    document.getElementById('jobCategory').value,
      description: document.getElementById('jobDescription').value,
      requirements: document.getElementById('jobRequirements').value.split(',').map(r => r.trim())
    };

    addJob(jobData);
    showToast('✅ Job posted successfully!');
    setTimeout(() => window.location.href = 'jobs.html', 1800);
  });
}

// Run page-specific logic on load
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname;

  if (page.includes('jobs.html'))       initJobsPage();
  if (page.includes('job-detail.html')) initJobDetailPage();
  if (page.includes('post-job.html'))   initPostJobPage();
});
