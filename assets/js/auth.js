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
      welcome.textContent = `Bonjour, ${firstName}`;
      const logout = document.createElement('button');
      logout.className = 'btn secondary';
      logout.textContent = 'D\u00e9connexion';
      logout.addEventListener('click', () => {
        localStorage.removeItem('tkflow_current_user');
        window.location.reload();
      });
      area.appendChild(welcome);
      area.appendChild(logout);
    } else {
      const login = document.createElement('a');
      login.className = 'btn secondary';
      login.href = './login.html';
      login.textContent = 'Connexion';
      const register = document.createElement('a');
      register.className = 'btn primary';
      register.href = './signup.html';
      register.textContent = "S'inscrire";
      area.appendChild(login);
      area.appendChild(register);
    }
  });
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errorEl = document.getElementById('authError');
  errorEl.textContent = '';

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: email, password })
    });
    const data = await response.json();

    if (!response.ok) {
      errorEl.textContent = data.error || 'Erreur de connexion.';
      return;
    }

    localStorage.setItem('tkflow_current_user', JSON.stringify(data.user));
    window.location.href = './index.html';
  } catch {
    errorEl.textContent = 'Erreur de connexion. Veuillez r\u00e9essayer.';
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const confirm = document.getElementById('signupConfirm').value.trim();
  const errorEl = document.getElementById('authError');
  errorEl.textContent = '';

  if (password !== confirm) {
    errorEl.textContent = 'Les mots de passe ne correspondent pas.';
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();

    if (!response.ok) {
      errorEl.textContent = data.error || 'Erreur lors de la cr\u00e9ation du compte.';
      return;
    }

    localStorage.setItem('tkflow_current_user', JSON.stringify(data.user));
    window.location.href = './index.html';
  } catch {
    errorEl.textContent = 'Erreur. Veuillez r\u00e9essayer.';
  }
}

window.addEventListener('load', () => {
  const stored = localStorage.getItem('tkflow_current_user');
  if (stored) {
    const isAuthPage = window.location.pathname.includes('login') || window.location.pathname.includes('signup');
    if (isAuthPage) {
      window.location.href = './index.html';
      return;
    }
  }

  initHamburger();
  renderAuthArea();

  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  const signupForm = document.getElementById('signupForm');
  if (signupForm) signupForm.addEventListener('submit', handleSignup);
});
