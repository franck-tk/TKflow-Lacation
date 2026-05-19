const API_BASE = '/api';

function initHamburger() {
  const btn = document.getElementById('hamburgerBtn');
  const wrapper = document.getElementById('navWrapper');
  if (!btn || !wrapper) return;
  btn.addEventListener('click', () => {
    const open = wrapper.classList.toggle('open');
    btn.textContent = open ? '\u2715' : '\u2630';
  });
}

function renderAuthArea() {
  const areas = document.querySelectorAll('.auth-actions');
  const stored = localStorage.getItem('tkflow_current_user');
  const user = stored ? JSON.parse(stored) : null;
  areas.forEach(area => {
    area.innerHTML = '';
    if (user) {
      const firstName = (user.username || user.email || '').split(' ')[0];
      const welcome = document.createElement('span');
      welcome.className = 'user-welcome';
      welcome.textContent = `Hello, ${firstName}`;
      const logout = document.createElement('button');
      logout.className = 'btn secondary';
      logout.textContent = 'Logout';
      logout.addEventListener('click', () => {
        localStorage.removeItem('tkflow_current_user');
        window.location.href = './index.html';
      });
      area.appendChild(welcome);
      area.appendChild(logout);
    } else {
      const login = document.createElement('a');
      login.className = 'btn secondary';
      login.href = './login.html';
      login.textContent = 'Login';
      const register = document.createElement('a');
      register.className = 'btn primary';
      register.href = './signup.html';
      register.textContent = 'Sign Up';
      area.appendChild(login);
      area.appendChild(register);
    }
  });
}

function renderNav() {
  const stored = localStorage.getItem('tkflow_current_user');
  const current = stored ? JSON.parse(stored) : null;
  const isLoggedIn = !!current;
  const isSuperAdmin = current && current.role === 'superadmin';
  document.querySelectorAll('[data-nav="guest"]').forEach(el => el.classList.toggle('hidden', isLoggedIn));
  document.querySelectorAll('[data-nav="user"]').forEach(el => el.classList.toggle('hidden', !isLoggedIn));
  document.querySelectorAll('[data-nav="admin"]').forEach(el => el.classList.toggle('hidden', !isSuperAdmin));
}

function updateFileLabel(inputId, labelId) {
  const input = document.getElementById(inputId);
  const label = document.getElementById(labelId);
  if (!input || !label) return;
  input.addEventListener('change', () => {
    label.textContent = input.files[0]?.name || 'No file chosen';
  });
}

async function handleProfileSubmit(e) {
  e.preventDefault();
  const stored = localStorage.getItem('tkflow_current_user');
  if (!stored) { window.location.href = './login.html'; return; }
  const user = JSON.parse(stored);

  const errorEl = document.getElementById('profileError');
  errorEl.textContent = '';

  const cniNumber = document.getElementById('cniNumber').value.trim();
  if (!cniNumber) {
    errorEl.textContent = 'Please enter your CNI number.';
    return;
  }

  const formData = new FormData();
  formData.append('userId', user.id);
  formData.append('cniNumber', cniNumber);

  const cniFrontFile = document.getElementById('cniFront').files[0];
  const cniBackFile = document.getElementById('cniBack').files[0];
  const portraitFile = document.getElementById('portrait').files[0];
  if (cniFrontFile) formData.append('cniFront', cniFrontFile);
  if (cniBackFile) formData.append('cniBack', cniBackFile);
  if (portraitFile) formData.append('portrait', portraitFile);

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Saving\u2026';

  try {
    const response = await fetch(`${API_BASE}/profile/complete`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();

    if (!response.ok) {
      errorEl.textContent = data.error || 'Error saving profile.';
      btn.disabled = false;
      btn.textContent = 'Save & Continue';
      return;
    }

    const updatedUser = { ...user, ...data.user, profileComplete: true };
    localStorage.setItem('tkflow_current_user', JSON.stringify(updatedUser));

    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || './vehicules.html';
    window.location.href = redirect;
  } catch {
    errorEl.textContent = 'Error. Please try again.';
    btn.disabled = false;
    btn.textContent = 'Save & Continue';
  }
}

window.addEventListener('load', () => {
  const stored = localStorage.getItem('tkflow_current_user');
  if (!stored) {
    window.location.href = './login.html';
    return;
  }

  initHamburger();
  renderAuthArea();
  renderNav();
  updateFileLabel('cniFront', 'cniFrontLabel');
  updateFileLabel('cniBack', 'cniBackLabel');
  updateFileLabel('portrait', 'portraitLabel');

  const form = document.getElementById('profileForm');
  if (form) form.addEventListener('submit', handleProfileSubmit);
});
