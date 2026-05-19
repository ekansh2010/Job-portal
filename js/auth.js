// auth.js - Login and Registration logic

// Register a new user
function registerUser(name, email, password, role) {
  const users = JSON.parse(localStorage.getItem('jobPortal_users') || '[]');

  // Check if email already registered
  const exists = users.find(u => u.email === email);
  if (exists) {
    return { success: false, message: 'Email already registered. Please login.' };
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,  // Note: In real apps, never store plain passwords! Use bcrypt.
    role       // 'jobseeker' or 'recruiter'
  };

  users.push(newUser);
  localStorage.setItem('jobPortal_users', JSON.stringify(users));

  return { success: true, user: newUser };
}

// Login a user
function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem('jobPortal_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return { success: false, message: 'Invalid email or password. Please try again.' };
  }

  localStorage.setItem('jobPortal_currentUser', JSON.stringify(user));
  return { success: true, user };
}

// Handle registration form submit
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name     = document.getElementById('regName').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm  = document.getElementById('regConfirm').value;
    const role     = document.getElementById('regRole').value;
    const alertBox = document.getElementById('authAlert');

    // Basic validations
    if (!name || !email || !password || !role) {
      showAlert(alertBox, 'Please fill in all fields.', 'danger');
      return;
    }

    if (password !== confirm) {
      showAlert(alertBox, 'Passwords do not match.', 'danger');
      return;
    }

    if (password.length < 6) {
      showAlert(alertBox, 'Password must be at least 6 characters.', 'danger');
      return;
    }

    const result = registerUser(name, email, password, role);

    if (result.success) {
      showAlert(alertBox, '✅ Account created! Redirecting to login...', 'success');
      setTimeout(() => window.location.href = 'login.html', 1800);
    } else {
      showAlert(alertBox, result.message, 'danger');
    }
  });
}

// Handle login form submit
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const alertBox = document.getElementById('authAlert');

    if (!email || !password) {
      showAlert(alertBox, 'Please enter both email and password.', 'danger');
      return;
    }

    const result = loginUser(email, password);

    if (result.success) {
      showAlert(alertBox, `✅ Welcome back, ${result.user.name}! Redirecting...`, 'success');
      setTimeout(() => window.location.href = '../index.html', 1500);
    } else {
      showAlert(alertBox, result.message, 'danger');
    }
  });
}

// Helper: show alert box
function showAlert(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.className = `alert alert-${type} mt-3`;
  el.style.display = 'block';
}
