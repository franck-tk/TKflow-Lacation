// ===============================
// TKFLOW MAIN SCRIPT
// ===============================

// Backend URL
const API_BASE = '/api';

let VEHICLES = [];
let currentUser = null;

function showAdminButton() {
  const adminBtn = document.getElementById("adminButton");
  if (!adminBtn) return;

  const user = JSON.parse(localStorage.getItem("tkflow_current_user"));

  if (user && user.role === "superadmin") {
    adminBtn.classList.remove("hidden");
  }
}
// ===============================
// VEHICLES DATA
// ===============================
function createStaticVehicleTemplates() {
  return [
    {
      brand: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      basePrice: 55,
      seats: 5,
      luggage: 3,
      fuel: 'Petrol',
      description: 'Reliable compact sedan for city and highway travel.'
    },
    {
      brand: 'Honda',
      model: 'Civic',
      category: 'Sedan',
      basePrice: 60,
      seats: 5,
      luggage: 3,
      fuel: 'Petrol',
      description: 'Comfortable and modern sedan with excellent fuel economy.'
    },
    {
      brand: 'BMW',
      model: '3 Series',
      category: 'Luxury Sedan',
      basePrice: 110,
      seats: 5,
      luggage: 3,
      fuel: 'Petrol',
      description: 'Premium business sedan with dynamic performance and style.'
    },
    {
      brand: 'Mercedes',
      model: 'C-Class',
      category: 'Luxury Sedan',
      basePrice: 120,
      seats: 5,
      luggage: 3,
      fuel: 'Diesel',
      description: 'Sophisticated luxury sedan with advanced comfort features.'
    },
    {
      brand: 'Ford',
      model: 'Explorer',
      category: 'SUV',
      basePrice: 105,
      seats: 7,
      luggage: 5,
      fuel: 'Petrol',
      description: 'Spacious SUV ideal for family trips and weekend adventures.'
    },
    {
      brand: 'Nissan',
      model: 'Sentra',
      category: 'Sedan',
      basePrice: 52,
      seats: 5,
      luggage: 3,
      fuel: 'Petrol',
      description: 'Comfortable sedan with great fuel economy for everyday use.'
    },
    {
      brand: 'Jeep',
      model: 'Grand Cherokee',
      category: 'SUV',
      basePrice: 125,
      seats: 7,
      luggage: 5,
      fuel: 'Diesel',
      description: 'Rugged SUV built for comfort and off-road capability.'
    },
    {
      brand: 'Tesla',
      model: 'Model 3',
      category: 'Electric',
      basePrice: 130,
      seats: 5,
      luggage: 3,
      fuel: 'Electric',
      description: 'Electric sedan with advanced autopilot and premium interior.'
    },
    {
      brand: 'Renault',
      model: 'Clio',
      category: 'Compact',
      basePrice: 48,
      seats: 5,
      luggage: 2,
      fuel: 'Petrol',
      description: 'Compact hatchback perfect for city driving and easy parking.'
    }
  ];
}

function getVehicleImageUrl(brand, model, variant) {
  return `./assets/images/${brand.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}-${variant.toLowerCase()}.jpg`;
}

function getVehicleImageUrlFromName(name) {
  const genericFallback = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80';
  const fallbackMap = {
    'Toyota Corolla': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    'Honda Civic': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
    'Nissan Sentra': 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80',
    'BMW 3 Series': 'https://images.unsplash.com/photo-1519648023493-d82b5f8d7d2e?auto=format&fit=crop&w=1200&q=80',
    'Mercedes C-Class': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    'Ford Explorer': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
    'Jeep Grand Cherokee': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    'Tesla Model 3': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
    'Renault Clio': 'https://images.unsplash.com/photo-1462215941521-5f1e7cae8835?auto=format&fit=crop&w=1200&q=80'
  };

  const imageKey = Object.keys(fallbackMap).find(key => name.startsWith(key));
  return fallbackMap[imageKey] || genericFallback;
}

function generateStaticVehicles() {
  const templates = createStaticVehicleTemplates();
  const variants = ['standard', 'premium', 'executive', 'sport', 'touring'];

  const vehicles = [];
  let idCounter = 1;

  templates.forEach(template => {
    variants.forEach((variant, index) => {
      vehicles.push({
        id: `car-${idCounter++}`,
        name: `${template.brand} ${template.model} ${variant}`,
        category: template.category,
        pricePerDay: template.basePrice + index * 7,
        seats: template.seats,
        luggage: template.luggage,
        fuel: template.fuel,
        image: getVehicleImageUrl(template.brand, template.model, variant),
        description: template.description
      });
    });
  });

  return vehicles;
}

document.addEventListener("DOMContentLoaded", () => {
  const adminBtn = document.getElementById("adminButton");

  const user = getCurrentUser();

  if (adminBtn && user && user.role === "superadmin") {
    adminBtn.classList.remove("hidden");
  }
});

const STATIC_VEHICLES = generateStaticVehicles();
const DISPLAY_VEHICLE_BASES = [
  'Toyota Corolla',
  'Honda Civic',
  'Nissan Sentra',
  'BMW 3 Series',
  'Mercedes C-Class',
  'Ford Explorer',
  'Jeep Grand Cherokee',
  'Tesla Model 3',
  'Renault Clio'
];
const VEHICLE_IMAGE_MAP = {
  'Toyota Corolla': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
  'Honda Civic': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
  'Nissan Sentra': 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80',
  'BMW 3 Series': 'https://images.unsplash.com/photo-1519648023493-d82b5f8d7d2e?auto=format&fit=crop&w=1200&q=80',
  'Mercedes C-Class': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
  'Ford Explorer': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
  'Jeep Grand Cherokee': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
  'Tesla Model 3': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
  'Renault Clio': 'https://images.unsplash.com/photo-1462215941521-5f1e7cae8835?auto=format&fit=crop&w=1200&q=80'
};

let filterState = {
  category: 'All',
  query: ''
};

function getVehicleBrand(vehicle) {
  return vehicle.name.split(' ')[0];
}

function getFilterCategories() {
  const brands = new Set(VEHICLES.map(vehicle => getVehicleBrand(vehicle)));
  return ['All', ...Array.from(brands).sort()];
}

function filterVehicles() {
  const search = filterState.query.toLowerCase();
  return VEHICLES.filter(vehicle => {
    const brand = getVehicleBrand(vehicle);
    const matchesCategory = filterState.category === 'All' || brand === filterState.category;
    const matchesSearch = !search || [vehicle.name, brand, vehicle.category, vehicle.description]
      .some(text => text.toLowerCase().includes(search));
    return matchesCategory && matchesSearch;
  });
}

function renderFilterControls() {
  const filterContainer = document.getElementById('categoryFilters');
  const searchInput = document.getElementById('vehicleSearch');
  if (!filterContainer || !searchInput) return;

  filterContainer.innerHTML = '';
  getFilterCategories().forEach(category => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `btn tertiary category-button${filterState.category === category ? ' active' : ''}`;
    button.textContent = category;
    button.addEventListener('click', () => {
      filterState.category = category;
      renderFilterControls();
      renderVehicles();
    });
    filterContainer.appendChild(button);
  });

  searchInput.value = filterState.query;
  searchInput.addEventListener('input', event => {
    filterState.query = event.target.value.trim();
    renderVehicles();
  });
}

async function loadVehicles() {
  try {
    const response = await fetch(`${API_BASE}/vehicles`);
    if (!response.ok) {
      throw new Error('Vehicle API error');
    }
    VEHICLES = await response.json();
    if (!VEHICLES.length) {
      VEHICLES = STATIC_VEHICLES;
    }
  } catch (error) {
    console.error('Failed to load vehicles:', error);
    VEHICLES = STATIC_VEHICLES;
  }

  VEHICLES = VEHICLES.map(vehicle => {
    const imageKey = Object.keys(VEHICLE_IMAGE_MAP).find(key => vehicle.name.startsWith(key));
    return {
      ...vehicle,
      image: vehicle.image || VEHICLE_IMAGE_MAP[imageKey] || getVehicleImageUrlFromName(vehicle.name),
      pricePerDay: Number(vehicle.pricePerDay) || 0,
      seats: Number(vehicle.seats) || vehicle.seats || 0,
      luggage: Number(vehicle.luggage) || vehicle.luggage || 3
    };
  });

  const selectedVehicles = DISPLAY_VEHICLE_BASES.map(baseName => {
    const vehicle = VEHICLES.find(v => v.name.startsWith(`${baseName} `));
    if (!vehicle) return null;
    return {
      ...vehicle,
      name: baseName
    };
  }).filter(Boolean);

  const seenModels = new Set(selectedVehicles.map(vehicle => vehicle.name));
  if (selectedVehicles.length < 9) {
    const fallbackVehicles = STATIC_VEHICLES.map(vehicle => ({
      ...vehicle,
      name: vehicle.name.replace(/\s+(Standard|Premium|Executive|Sport|Touring)$/i, '')
    }));

    for (const vehicle of fallbackVehicles) {
      if (selectedVehicles.length >= 9) break;
      if (seenModels.has(vehicle.name)) continue;
      seenModels.add(vehicle.name);
      selectedVehicles.push(vehicle);
    }
  }

  if (selectedVehicles.length < 9) {
    for (const vehicle of VEHICLES) {
      if (selectedVehicles.length >= 9) break;
      const baseName = vehicle.name.replace(/\s+(Standard|Premium|Executive|Sport|Touring)$/i, '');
      if (seenModels.has(baseName)) continue;
      seenModels.add(baseName);
      selectedVehicles.push({
        ...vehicle,
        name: baseName
      });
    }
  }

  VEHICLES = selectedVehicles.slice(0, 9);
}

function getCurrentUser() {
  return currentUser;
}

function setCurrentUser(user) {
  currentUser = user;
  localStorage.setItem('tkflow_current_user', JSON.stringify(user));
}

function clearCurrentUser() {
  currentUser = null;
  localStorage.removeItem('tkflow_current_user');
}

async function getReservations(userId) {
  try {
    const response = await fetch(`${API_BASE}/reservations/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to load reservations:', error);
    return [];
  }
}

async function isVehicleReserved(vehicleId) {
  const reservations = await getReservations(getCurrentUser()?.id || '');
  return reservations.some(r => r.vehicleId === vehicleId && r.status === 'confirmed');
}

function formatMoney(value) {
  const amount = Number(value);
  if (Number.isNaN(amount)) return '$0.00';
  return `$${amount.toFixed(2)}`;
}

function daysBetween(start, end) {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function fetchAdminUsers() {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  try {
    const response = await fetch(`${API_BASE}/admin/users?actorId=${currentUser.id}`);
    if (!response.ok) {
      throw new Error('Unable to load admin users');
    }
    return await response.json();
  } catch (error) {
    console.error('Admin user fetch failed:', error);
    return [];
  }
}

async function updateUserRole(userId, role) {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;
  const response = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actorId: currentUser.id, role })
  });
  return response.json();
}

async function deleteAdminUser(userId) {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;
  const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actorId: currentUser.id })
  });
  return response.json();
}

function loadCurrentUser() {
  const stored = localStorage.getItem('tkflow_current_user');
  if (stored) {
    currentUser = JSON.parse(stored);
    if (currentUser && !currentUser.role) {
      currentUser.role = 'user';
    }
  }
}

function renderAuthButtons() {
  const authAreas = document.querySelectorAll('.auth-actions');
  const current = getCurrentUser();
  authAreas.forEach(area => {
    area.innerHTML = '';
    if (current) {
      const welcome = document.createElement('span');
      welcome.textContent = `Hi, ${current.username || current.email || current.phone}`;
      welcome.className = 'user-welcome';
      area.appendChild(welcome);
      if (current.role) {
        const roleBadge = document.createElement('span');
        roleBadge.className = 'role-badge';
        roleBadge.textContent = current.role === 'superadmin' ? 'Superadmin' : current.role === 'admin' ? 'Admin' : 'Client';
        area.appendChild(roleBadge);
      }
      const logout = document.createElement('button');
      logout.className = 'btn secondary';
      logout.textContent = 'Logout';
      logout.addEventListener('click', () => {
        clearCurrentUser();
        renderAuthButtons();
        displayReservationSummary();
      });
      area.appendChild(welcome);
      area.appendChild(logout);
    } else {
      const login = document.createElement('button');
      login.className = 'btn secondary';
      login.textContent = 'Login';
      login.id = 'loginButton';
      login.addEventListener('click', () => openAuthModal('login'));
      const register = document.createElement('button');
      register.className = 'btn primary';
      register.textContent = 'Sign Up';
      register.id = 'registerButton';
      register.addEventListener('click', () => openAuthModal('register'));
      area.appendChild(login);
      area.appendChild(register);
    }
  });
}

function openAuthModal(mode) {
  const backdrop = document.getElementById('modalBackdrop');
  const modal = document.getElementById('authModal');
  backdrop.classList.remove('hidden');
  modal.classList.remove('hidden');
  modal.innerHTML = '';
  const close = document.createElement('button');
  close.className = 'modal-close';
  close.textContent = '✕';
  close.addEventListener('click', closeModal);
  modal.appendChild(close);

  const title = document.createElement('h2');
  title.textContent = mode === 'login' ? 'Login to TKflow' : 'Create a TKflow account';
  modal.appendChild(title);

  const form = document.createElement('form');
  form.className = 'field-group';

  if (mode === 'register') {
    form.innerHTML = `
      <label>Name</label><input type="text" id="authName" required placeholder="Full name">
      <label>Phone</label><input type="tel" id="authPhone" required placeholder="+221 77 000 0000">
      <label>Email</label><input type="email" id="authEmail" required placeholder="you@example.com">
      <label>Password</label><input type="password" id="authPassword" required placeholder="Create password">
      <label>Confirm password</label><input type="password" id="authConfirmPassword" required placeholder="Confirm password">
      <label>CNI front image</label>
      <div class="file-with-camera">
        <input type="file" id="authCniFront" accept="image/*" required>
        <button type="button" class="btn tertiary" id="takeFront">Take Photo</button>
      </div>
      <label>CNI back image</label>
      <div class="file-with-camera">
        <input type="file" id="authCniBack" accept="image/*" required>
        <button type="button" class="btn tertiary" id="takeBack">Take Photo</button>
      </div>
      <label>Portrait photo</label>
      <div class="file-with-camera">
        <input type="file" id="authPortrait" accept="image/*" required>
        <button type="button" class="btn tertiary" id="takePortrait">Take Photo</button>
      </div>
      <button class="btn primary" type="submit">Create account</button>
    `;
  } else {
    form.innerHTML = `
      <label>Phone or Email</label><input type="text" id="authLogin" required placeholder="Phone or email">
      <label>Password</label><input type="password" id="authLoginPassword" required placeholder="Password">
      <button class="btn primary" type="submit">Login</button>
    `;
  }

  modal.appendChild(form);

  backdrop.addEventListener('click', closeModal);

  // Attach camera buttons if present
  const takeFrontBtn = document.getElementById('takeFront');
  const takeBackBtn = document.getElementById('takeBack');
  const takePortraitBtn = document.getElementById('takePortrait');
  if (takeFrontBtn) takeFrontBtn.addEventListener('click', () => openCameraFor('authCniFront'));
  if (takeBackBtn) takeBackBtn.addEventListener('click', () => openCameraFor('authCniBack'));
  if (takePortraitBtn) takePortraitBtn.addEventListener('click', () => openCameraFor('authPortrait'));

  const cameraSupported = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  const secureContext = window.isSecureContext || ['localhost', '127.0.0.1', '0.0.0.0'].includes(location.hostname);
  if (!cameraSupported || !secureContext) {
    [takeFrontBtn, takeBackBtn, takePortraitBtn].forEach(btn => {
      if (btn) {
        btn.disabled = true;
        btn.title = 'Camera unavailable. Upload the photo manually.';
      }
    });

    const cameraNotice = document.createElement('p');
    cameraNotice.className = 'camera-note';
    cameraNotice.textContent = 'La capture photo nécessite un accès caméra sécurisé. Si elle est indisponible, téléchargez l’image manuellement.';
    form.appendChild(cameraNotice);
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (mode === 'register') {
      handleRegister();
    } else {
      handleLogin();
    }
  });

}

function closeModal() {
  document.getElementById('modalBackdrop').classList.add('hidden');
  document.getElementById('authModal').classList.add('hidden');
  document.getElementById('vehicleModal')?.classList.add('hidden');
}

// Camera capture overlay
let _cameraStream = null;
function openCameraFor(inputId) {
  const input = document.getElementById(inputId);
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Camera not supported. Please upload your photo manually.');
    if (input) input.click();
    return;
  }

  const secureContext = window.isSecureContext || ['localhost', '127.0.0.1', '0.0.0.0'].includes(location.hostname);
  if (!secureContext) {
    alert('Camera access requires HTTPS or localhost. Importez le fichier manuellement.');
    if (input) input.click();
    return;
  }

  // create overlay
  let overlay = document.getElementById('cameraOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'cameraOverlay';
    overlay.innerHTML = `
      <div class="camera-card">
        <video id="cameraVideo" autoplay playsinline></video>
        <div class="camera-controls">
          <button id="cameraCapture" class="btn primary">Capture</button>
          <button id="cameraCancel" class="btn secondary">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const video = document.getElementById('cameraVideo');
  overlay.classList.remove('hidden');

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      _cameraStream = stream;
      video.srcObject = stream;
      video.play();
    }).catch(err => {
      closeCameraOverlay();
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError' || err?.name === 'SecurityError') {
        alert('Permission caméra refusée. Utilisez l’import manuel de fichiers.');
      } else {
        alert('Camera not available: ' + err.message);
      }
      if (input) input.click();
    });

  document.getElementById('cameraCancel').onclick = () => closeCameraOverlay();
  document.getElementById('cameraCapture').onclick = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async blob => {
      const file = new File([blob], `${inputId}.png`, { type: 'image/png' });
      const input = document.getElementById(inputId);
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
      }
      closeCameraOverlay();
    }, 'image/png');
  };
}

function closeCameraOverlay() {
  const overlay = document.getElementById('cameraOverlay');
  if (overlay) overlay.classList.add('hidden');
  if (_cameraStream) {
    _cameraStream.getTracks().forEach(t => t.stop());
    _cameraStream = null;
  }
}

async function handleRegister() {
  const name = document.getElementById('authName').value.trim();
  const phone = document.getElementById('authPhone').value.trim();
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value.trim();
  const confirmPassword = document.getElementById('authConfirmPassword').value.trim();
  const cniFront = document.getElementById('authCniFront').files[0];
  const cniBack = document.getElementById('authCniBack').files[0];
  const portrait = document.getElementById('authPortrait').files[0];

  if (!name || !phone || !email || !password || !confirmPassword || !cniFront || !cniBack || !portrait) {
    alert('Please complete every field and upload identity documents.');
    return;
  }
  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('phone', phone);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('cniFront', cniFront);
  formData.append('cniBack', cniBack);
  formData.append('portrait', portrait);

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'Registration failed');
      return;
    }

    setCurrentUser(data.user);
    closeModal();
    renderAuthButtons();
    alert('Registration successful. You are now logged in.');
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed. Please try again.');
  }
}

async function handleLogin() {
  const loginValue = document.getElementById('authLogin').value.trim();
  const password = document.getElementById('authLoginPassword').value.trim();

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: loginValue, password })
    });
    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'Login failed');
      return;
    }

    setCurrentUser(data.user);
    closeModal();
    renderAuthButtons();
    alert('Welcome back! You are logged in.');
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please try again.');
  }
}


async function renderVehicles() {
  const grid = document.getElementById('vehiclesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const vehiclesToRender = filterVehicles().slice(0, 9);
  const reservations = currentUser ? await getReservations(currentUser.id) : [];
  const reservedIds = new Set(reservations.filter(r => r.status === 'confirmed').map(r => r.vehicleId));

  if (!vehiclesToRender.length) {
    const message = document.createElement('div');
    message.className = 'confirmation-card';
    message.innerHTML = `
      <h3>No vehicles found</h3>
      <p>Try another search term or select a different category.</p>
    `;
    grid.appendChild(message);
    return;
  }

  vehiclesToRender.forEach(vehicle => {
    const reserved = reservedIds.has(vehicle.id);
    const imageSrc = vehicle.image || '';
    const imageElement = imageSrc
      ? `<img src="${imageSrc}" alt="${vehicle.name}">`
      : `<div class="vehicle-image-placeholder">Image à ajouter</div>`;
    const card = document.createElement('article');
    card.className = 'vehicle-card';
    card.innerHTML = `
      ${imageElement}
      <div class="vehicle-info">
        <h3 class="vehicle-name filter-link">${vehicle.name}</h3>
        <p class="vehicle-model"><strong>Modèle :</strong> ${vehicle.name}</p>
        <p class="vehicle-price"><strong>${formatMoney(vehicle.pricePerDay)}</strong> / jour</p>
        <p class="vehicle-description">${vehicle.description}</p>
        <div class="vehicle-meta">
          <span>Catégorie: ${vehicle.category}</span>
          <span>Places: ${vehicle.seats}</span>
        </div>
        <div class="vehicle-meta">
          <span>Carburant: ${vehicle.fuel}</span>
          <span>Bagages: ${vehicle.luggage}</span>
        </div>
        <div class="vehicle-actions">
          <button class="btn primary" data-id="${vehicle.id}">${reserved ? 'Indisponible' : 'Réserver'}</button>
        </div>
      </div>
    `;
    const button = card.querySelector('button');
    const nameLink = card.querySelector('.vehicle-name');
    if (nameLink) {
      nameLink.addEventListener('click', () => {
        filterState.category = 'All';
        filterState.query = vehicle.name;
        renderFilterControls();
        renderVehicles();
      });
    }
    button.disabled = reserved;
    button.addEventListener('click', () => {
      if (reserved) return;
      window.location.href = `./reservations.html?vehicleId=${encodeURIComponent(vehicle.id)}`;
    });

    // Add "Lire la suite" toggle for description only if description is long enough
    const actionsDiv = card.querySelector('.vehicle-actions');
    const descEl = card.querySelector('.vehicle-description');
    if (descEl && actionsDiv && descEl.textContent.length > 100) {
      const readMoreBtn = document.createElement('button');
      readMoreBtn.type = 'button';
      readMoreBtn.className = 'btn tertiary read-more';
      readMoreBtn.textContent = 'Lire la suite';
      readMoreBtn.addEventListener('click', () => {
        const expanded = descEl.classList.toggle('expanded');
        readMoreBtn.textContent = expanded ? 'Réduire' : 'Lire la suite';
      });
      actionsDiv.insertBefore(readMoreBtn, actionsDiv.firstChild);
    }

    if (reserved) {
      const badge = document.createElement('div');
      badge.textContent = 'Booked';
      badge.style.cssText = 'position:absolute;top:1rem;right:1rem;background:rgba(249,115,22,0.9);padding:0.6rem 0.9rem;border-radius:999px;font-weight:700;font-size:0.9rem;';
      card.appendChild(badge);
    }
    grid.appendChild(card);
  });
}


function showVehicleModal(vehicle) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    openAuthModal('login');
    return;
  }
  const backdrop = document.getElementById('modalBackdrop');
  const modal = document.getElementById('vehicleModal');
  backdrop.classList.remove('hidden');
  modal.classList.remove('hidden');
  modal.innerHTML = '';

  const close = document.createElement('button');
  close.className = 'modal-close';
  close.textContent = '✕';
  close.addEventListener('click', closeModal);
  modal.appendChild(close);

  const title = document.createElement('h2');
  title.textContent = `Reserve ${vehicle.name}`;
  modal.appendChild(title);

  const details = document.createElement('div');
  details.className = 'vehicle-details';
  details.innerHTML = `
    <div class="labels">
      <p><strong>Category:</strong> ${vehicle.category}</p>
      <p><strong>Seats:</strong> ${vehicle.seats}</p>
      <p><strong>Luggage:</strong> ${vehicle.luggage}</p>
      <p><strong>Fuel:</strong> ${vehicle.fuel}</p>
      <p><strong>GPS tracking:</strong> Included for every rental</p>
    </div>
    <div class="summary">
      <strong>${vehicle.description}</strong>
      <p>Price per day: ${formatMoney(vehicle.pricePerDay)}</p>
      <p>Reservation cannot proceed if the vehicle is already booked.</p>
    </div>
  `;

  const reservationForm = document.createElement('form');
  reservationForm.className = 'field-group';
  reservationForm.innerHTML = `
    <label>Start date</label><input type="date" id="startDate" required>
    <label>End date</label><input type="date" id="endDate" required>
    <label>Payment method</label>
    <select id="paymentMethod" required>
      <option value="Orange Money">Orange Money</option>
      <option value="MTN Money">MTN Money</option>
      <option value="Bank Transfer">Bank Transfer</option>
    </select>
    <div class="summary" id="priceSummary">
      <p><strong>Duration:</strong> 0 days</p>
      <p><strong>Total:</strong> ${formatMoney(0)}</p>
    </div>
    <button class="btn primary" type="submit">Confirm Reservation</button>
  `;

  modal.appendChild(details);
  modal.appendChild(reservationForm);

  const startDateInput = reservationForm.querySelector('#startDate');
  const endDateInput = reservationForm.querySelector('#endDate');
  const priceSummary = reservationForm.querySelector('#priceSummary');

  function updateSummary() {
    const startValue = startDateInput.value;
    const endValue = endDateInput.value;
    if (!startValue || !endValue) {
      priceSummary.innerHTML = `<p><strong>Duration:</strong> 0 days</p><p><strong>Total:</strong> ${formatMoney(0)}</p>`;
      return;
    }
    const start = new Date(startValue);
    const end = new Date(endValue);
    if (end < start) {
      priceSummary.innerHTML = `<p style="color:#fb7185;"><strong>Error:</strong> End date must be after start date.</p>`;
      return;
    }
    const duration = daysBetween(start, end);
    const total = duration * vehicle.pricePerDay;
    priceSummary.innerHTML = `
      <p><strong>Duration:</strong> ${duration} day${duration === 1 ? '' : 's'}</p>
      <p><strong>Unit price:</strong> ${formatMoney(vehicle.pricePerDay)}</p>
      <p><strong>Total:</strong> ${formatMoney(total)}</p>
    `;
  }

  startDateInput.addEventListener('change', updateSummary);
  endDateInput.addEventListener('change', updateSummary);

  reservationForm.addEventListener('submit', async event => {
    event.preventDefault();
    const start = startDateInput.value;
    const end = endDateInput.value;
    const paymentMethod = reservationForm.querySelector('#paymentMethod').value;

    const reserved = await isVehicleReserved(vehicle.id);
    if (reserved) {
      alert('This vehicle is currently unavailable. Please select another car.');
      closeModal();
      renderVehicles();
      return;
    }
    if (!start || !end) {
      alert('Please select both start date and end date.');
      return;
    }
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate < startDate) {
      alert('The end date must be after the start date.');
      return;
    }
    const duration = daysBetween(startDate, endDate);
    const total = duration * vehicle.pricePerDay;
    const currentUser = getCurrentUser();

    try {
      const response = await fetch(`${API_BASE}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          vehicleId: vehicle.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          paymentMethod
        })
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Reservation failed');
        return;
      }

      // If mobile money, start payment flow (PIN)
      if (paymentMethod === 'Orange Money' || paymentMethod === 'MTN Money') {
        // reservation created with status 'pending'
        const reservationId = data.reservation.id;
        await initiatePayment(reservationId);
        return;
      }

      // Non-mobile payment: confirmed immediately
      closeModal();
      renderVehicles();
      displayReservationSummary();
      const emailStatus = data.emailNotification?.sent
        ? 'Un email de confirmation a été envoyé.'
        : 'Réservation confirmée mais l’email n’a pas pu être envoyé.';
      alert(`Reservation confirmed! ${emailStatus}`);
    } catch (error) {
      console.error('Reservation error:', error);
      alert('Reservation failed. Please try again.');
    }
  });
}

// Payment flow (frontend)
async function initiatePayment(reservationId) {
  try {
    const resp = await fetch(`${API_BASE}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservationId })
    });
    const data = await resp.json();
    if (!resp.ok) {
      alert(data.error || 'Payment initiation failed');
      return;
    }
    openPaymentModal(data.transactionId);
  } catch (err) {
    console.error('Payment initiate error', err);
    alert('Payment failed to start');
  }
}

function openPaymentModal(transactionId) {
  const backdrop = document.getElementById('modalBackdrop');
  backdrop.classList.remove('hidden');

  let modal = document.getElementById('paymentModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'paymentModal';
    modal.className = 'vehicle-modal';
    document.body.appendChild(modal);
  }
  modal.classList.remove('hidden');
  modal.innerHTML = '';

  const close = document.createElement('button');
  close.className = 'modal-close';
  close.textContent = '✕';
  close.addEventListener('click', () => { backdrop.classList.add('hidden'); modal.classList.add('hidden'); });
  modal.appendChild(close);

  const title = document.createElement('h2');
  title.textContent = 'Paiement Mobile Money';
  modal.appendChild(title);

  const info = document.createElement('div');
  info.className = 'field-group';
  info.innerHTML = `
    <p>Un PIN a été envoyé à votre téléphone. Pour les tests, vérifiez la console du serveur pour le code.</p>
    <label>PIN</label><input type="text" id="paymentPin" maxlength="6" placeholder="">
    <div style="display:flex;gap:0.5rem;margin-top:1rem;"></div>
  `;
  modal.appendChild(info);

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'btn primary';
  confirmBtn.textContent = 'Confirmer le paiement';
  confirmBtn.addEventListener('click', async () => {
    const pin = document.getElementById('paymentPin').value.trim();
    if (!pin) return alert('Entrez le PIN');
    try {
      const resp = await fetch(`${API_BASE}/pay/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, pin })
      });
      const data = await resp.json();
      if (!resp.ok) {
        alert(data.error || 'PIN invalide');
        return;
      }
      backdrop.classList.add('hidden');
      modal.classList.add('hidden');
      alert(`✓ Paiement confirmé!\n\nUne facture et un message de confirmation ont été envoyés à:\n📧 ${currentUser.email}\n📱 ${currentUser.phone}\n\nVotre réservation est maintenant active.`);
      renderVehicles();
      displayReservationSummary();
    } catch (err) {
      console.error('Payment confirm error', err);
      alert('Erreur lors de la confirmation du paiement');
    }
  });
  modal.appendChild(confirmBtn);
}

async function displayReservationSummary() {
  const container = document.getElementById('reservationSummary');
  if (!container) return;
  const currentUser = getCurrentUser();
  container.innerHTML = '';
  if (!currentUser) {
    const prompt = document.createElement('div');
    prompt.className = 'confirmation-card';
    prompt.innerHTML = `
      <h3>Login required</h3>
      <p>You must login or register before viewing or creating reservations.</p>
      <button class="btn primary" id="reservationLogin">Login</button>
    `;
    container.appendChild(prompt);
    document.getElementById('reservationLogin').addEventListener('click', () => openAuthModal('login'));
    return;
  }

  const reservations = await getReservations(currentUser.id);
  if (!reservations.length) {
    const none = document.createElement('div');
    none.className = 'confirmation-card';
    none.innerHTML = `
      <h3>No reservations yet</h3>
      <p>Visit the Vehicles page to choose a car and book your next trip.</p>
      <a href="./vehicules.html" class="btn primary">Browse Vehicles</a>
    `;
    container.appendChild(none);
    return;
  }

  reservations.forEach(res => {
    const card = document.createElement('div');
    card.className = 'reservation-card';
    card.innerHTML = `
      <h3>${res.vehicleName}</h3>
      <p><strong>From:</strong> ${formatDate(res.startDate)} <strong>To:</strong> ${formatDate(res.endDate)}</p>
      <p><strong>Duration:</strong> ${res.duration} day${res.duration === 1 ? '' : 's'}</p>
      <p><strong>Payment:</strong> ${res.paymentMethod}</p>
      <p><strong>Total amount:</strong> ${formatMoney(res.total)}</p>
      <p><strong>Status:</strong> ${res.status}</p>
    `;
    container.appendChild(card);
  });
}

function renderReservationBooking() {
  const bookingContainer = document.getElementById('reservationBooking');
  if (!bookingContainer) return;

  const currentUser = getCurrentUser();
  const urlParams = new URLSearchParams(window.location.search);
  const vehicleId = urlParams.get('vehicleId');

  bookingContainer.innerHTML = '';
  if (!vehicleId) return;

  if (!currentUser) {
    const authPrompt = document.createElement('div');
    authPrompt.className = 'confirmation-card';
    authPrompt.innerHTML = `
      <h3>Connexion requise</h3>
      <p>Vous devez vous connecter ou vous inscrire pour réserver un véhicule.</p>
      <button class="btn primary" id="bookingLogin">Login</button>
    `;
    bookingContainer.appendChild(authPrompt);
    document.getElementById('bookingLogin').addEventListener('click', () => openAuthModal('login'));
    return;
  }

  const vehicle = VEHICLES.find(v => String(v.id) === vehicleId);
  if (!vehicle) {
    bookingContainer.innerHTML = `
      <div class="confirmation-card">
        <h3>Véhicule introuvable</h3>
        <p>Retournez à la page des véhicules pour choisir une autre option.</p>
        <a href="./vehicules.html" class="btn primary">Voir les véhicules</a>
      </div>
    `;
    return;
  }

  const bookingCard = document.createElement('div');
  bookingCard.className = 'reservation-card';
  bookingCard.innerHTML = `
    <h2>Réserver : ${vehicle.name}</h2>
    <div class="vehicle-details">
      <img src="${vehicle.image}" alt="${vehicle.name}">
      <div class="vehicle-info">
        <p><strong>Prix :</strong> ${formatMoney(vehicle.pricePerDay)} / jour</p>
        <p><strong>Catégorie :</strong> ${vehicle.category}</p>
        <p><strong>Places :</strong> ${vehicle.seats}</p>
        <p><strong>Carburant :</strong> ${vehicle.fuel}</p>
        <p><strong>Bagages :</strong> ${vehicle.luggage}</p>
        <p><strong>Description :</strong> ${vehicle.description}</p>
      </div>
    </div>
    <form id="vehicleBookingForm" class="field-group">
      <label>Date de début</label>
      <input type="date" id="bookingStartDate" required>
      <label>Date de fin</label>
      <input type="date" id="bookingEndDate" required>
      <label>Méthode de paiement</label>
      <select id="bookingPaymentMethod" required>
        <option value="Orange Money">Orange Money</option>
        <option value="MTN Money">MTN Money</option>
        <option value="Bank Transfer">Bank Transfer</option>
      </select>
      <div id="bookingSummary" class="summary">
        <p><strong>Durée :</strong> 0 jours</p>
        <p><strong>Total :</strong> ${formatMoney(0)}</p>
      </div>
      <button class="btn primary" type="submit">Payer et confirmer</button>
    </form>
  `;

  bookingContainer.appendChild(bookingCard);

  const form = document.getElementById('vehicleBookingForm');
  const startDateInput = document.getElementById('bookingStartDate');
  const endDateInput = document.getElementById('bookingEndDate');
  const paymentSelect = document.getElementById('bookingPaymentMethod');
  const summary = document.getElementById('bookingSummary');

  function updateBookingSummary() {
    const startDateValue = startDateInput.value;
    const endDateValue = endDateInput.value;
    if (!startDateValue || !endDateValue) {
      summary.innerHTML = `<p><strong>Durée :</strong> 0 jours</p><p><strong>Total :</strong> ${formatMoney(0)}</p>`;
      return;
    }
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    if (endDate < startDate) {
      summary.innerHTML = `<p style="color:#fb7185;"><strong>Erreur :</strong> la date de fin doit être après la date de début.</p>`;
      return;
    }
    const duration = daysBetween(startDate, endDate);
    summary.innerHTML = `
      <p><strong>Durée :</strong> ${duration} jour${duration === 1 ? '' : 's'}</p>
      <p><strong>Total :</strong> ${formatMoney(duration * vehicle.pricePerDay)}</p>
    `;
  }

  startDateInput.addEventListener('change', updateBookingSummary);
  endDateInput.addEventListener('change', updateBookingSummary);

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const startDateValue = startDateInput.value;
    const endDateValue = endDateInput.value;
    const paymentMethod = paymentSelect.value;

    if (!startDateValue || !endDateValue) {
      alert('Veuillez sélectionner les dates de début et de fin.');
      return;
    }

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    if (endDate < startDate) {
      alert('La date de fin doit être après la date de début.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          vehicleId: vehicle.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          paymentMethod
        })
      });
      const data = await response.json();
      if (!response.ok) {
        return alert(data.error || 'Impossible de créer la réservation.');
      }

      const emailStatus = data.emailNotification?.sent
        ? 'Un message de confirmation a été envoyé.'
        : 'Réservation confirmée, mais l’email n’a pas pu être envoyé.';
      alert(`Réservation confirmée ! ${emailStatus}`);
      window.location.href = './reservations.html';
    } catch (error) {
      console.error('Booking error:', error);
      alert('Erreur de réservation. Veuillez réessayer plus tard.');
    }
  });
}

function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    if (!name || !email || !message) {
      return alert('Please complete all contact fields.');
    }
    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send message');
      alert(data.message || 'Message sent successfully');
      form.reset();
    } catch (error) {
      console.error('Contact request failed:', error);
      alert('Unable to send message. Please try again later.');
    }
  });
}

async function renderDashboard() {
  const container = document.getElementById('dashboardContent');
  if (!container) return;
  const currentUser = getCurrentUser();
  container.innerHTML = '';

  if (!currentUser) {
    const prompt = document.createElement('div');
    prompt.className = 'confirmation-card';
    prompt.innerHTML = `
      <h3>Login required</h3>
      <p>You must login to access your dashboard.</p>
      <button class="btn primary" id="dashboardLogin">Login</button>
    `;
    container.appendChild(prompt);
    document.getElementById('dashboardLogin').addEventListener('click', () => openAuthModal('login'));
    return;
  }

  // Profile section
  const profileSection = document.createElement('div');
  profileSection.className = 'dashboard-section';
  profileSection.innerHTML = `
    <h2>Profile Information</h2>
    <div class="profile-card">
      <div class="profile-details">
        <p><strong>Name:</strong> ${currentUser.username}</p>
        <p><strong>Email:</strong> ${currentUser.email || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${currentUser.phone || 'Not provided'}</p>
        <p><strong>Member since:</strong> ${currentUser.createdAt ? formatDate(currentUser.createdAt) : 'N/A'}</p>
      </div>
      <div class="profile-documents">
        <h3>Identity Documents</h3>
        ${currentUser.cniFront ? `<p><strong>CNI Front:</strong> Uploaded</p>` : '<p><strong>CNI Front:</strong> Not uploaded</p>'}
        ${currentUser.cniBack ? `<p><strong>CNI Back:</strong> Uploaded</p>` : '<p><strong>CNI Back:</strong> Not uploaded</p>'}
        ${currentUser.portrait ? `<p><strong>Portrait:</strong> Uploaded</p>` : '<p><strong>Portrait:</strong> Not uploaded</p>'}
      </div>
    </div>
  `;
  container.appendChild(profileSection);

  // Recent reservations
  const reservations = await getReservations(currentUser.id);
  const reservationsSection = document.createElement('div');
  reservationsSection.className = 'dashboard-section';
  reservationsSection.innerHTML = '<h2>Recent Reservations</h2>';

  if (!reservations.length) {
    reservationsSection.innerHTML += '<p>No reservations found.</p>';
  } else {
    const recentReservations = reservations.slice(-5).reverse(); // Last 5, most recent first
    recentReservations.forEach(res => {
      const resCard = document.createElement('div');
      resCard.className = 'reservation-card';
      resCard.innerHTML = `
        <h3>${res.vehicleName}</h3>
        <p><strong>From:</strong> ${formatDate(res.startDate)} <strong>To:</strong> ${formatDate(res.endDate)}</p>
        <p><strong>Duration:</strong> ${res.duration} day${res.duration === 1 ? '' : 's'}</p>
        <p><strong>Total:</strong> ${formatMoney(res.total)}</p>
        <p><strong>Status:</strong> ${res.status}</p>
      `;
      reservationsSection.appendChild(resCard);
    });
  }
  container.appendChild(reservationsSection);

  // Quick actions
  const actionsSection = document.createElement('div');
  actionsSection.className = 'dashboard-section';
  actionsSection.innerHTML = `
    <h2>Quick Actions</h2>
    <div class="quick-actions">
      <a href="./vehicules.html" class="btn primary">Book New Vehicle</a>
      <a href="./reservations.html" class="btn secondary">View All Reservations</a>
      <a href="./contact.html" class="btn secondary">Contact Support</a>
    </div>
  `;
  container.appendChild(actionsSection);

  if (currentUser.role === 'superadmin') {
    const adminSection = document.createElement('div');
    adminSection.className = 'dashboard-section';
    adminSection.innerHTML = `
      <h2>Admin Console</h2>
      <p>Only the superadmin can promote users to admin or remove clients.</p>
      <div class="admin-table-wrapper"></div>
    `;
    container.appendChild(adminSection);
    await renderAdminUsers(adminSection.querySelector('.admin-table-wrapper'));
  }
}

async function renderAdminUsers(container) {
  container.innerHTML = '';
  const currentUser = getCurrentUser();
  if (!currentUser) {
    container.innerHTML = `
      <div class="confirmation-card">
        <h3>Connexion requise</h3>
        <p>Vous devez être connecté en tant que superadmin pour accéder à cet espace.</p>
        <button class="btn primary" id="adminLoginButton">Login</button>
      </div>
    `;
    document.getElementById('adminLoginButton').addEventListener('click', () => openAuthModal('login'));
    return;
  }

  if (currentUser.role !== 'superadmin') {
    container.innerHTML = `
      <div class="confirmation-card">
        <h3>Accès refusé</h3>
        <p>Seul un superadmin peut gérer les utilisateurs.</p>
      </div>
    `;
    return;
  }

  const users = await fetchAdminUsers();
  if (!users.length) {
    container.innerHTML = `
      <div class="confirmation-card">
        <h3>Aucun utilisateur trouvé</h3>
        <p>Les comptes clients apparaîtront ici une fois qu'ils auront été créés.</p>
      </div>
    `;
    return;
  }

  const table = document.createElement('table');
  table.className = 'admin-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Role</th>
        <th>Joined</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');

  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.username || '—'}</td>
      <td>${user.email || '—'}</td>
      <td>${user.phone || '—'}</td>
      <td>${user.role || 'user'}</td>
      <td>${user.createdAt ? formatDate(user.createdAt) : '—'}</td>
      <td class="admin-actions"></td>
    `;

    const actionCell = row.querySelector('.admin-actions');
    if (user.id !== currentUser.id && user.role !== 'superadmin') {
      if (user.role === 'user') {
        const promoteBtn = document.createElement('button');
        promoteBtn.className = 'btn tertiary';
        promoteBtn.textContent = 'Make admin';
        promoteBtn.addEventListener('click', async () => {
          const result = await updateUserRole(user.id, 'admin');
          if (result.error) return alert(result.error);
          await renderAdminUsers(container);
        });
        actionCell.appendChild(promoteBtn);
      } else if (user.role === 'admin') {
        const demoteBtn = document.createElement('button');
        demoteBtn.className = 'btn tertiary';
        demoteBtn.textContent = 'Demote to user';
        demoteBtn.addEventListener('click', async () => {
          const result = await updateUserRole(user.id, 'user');
          if (result.error) return alert(result.error);
          await renderAdminUsers(container);
        });
        actionCell.appendChild(demoteBtn);
      }

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn secondary';
      deleteBtn.textContent = 'Delete client';
      deleteBtn.addEventListener('click', async () => {
        if (!confirm(`Delete ${user.username || user.email}?`)) return;
        const result = await deleteAdminUser(user.id);
        if (result.error) return alert(result.error);
        await renderAdminUsers(container);
      });
      actionCell.appendChild(deleteBtn);
    } else {
      actionCell.textContent = 'No actions';
    }

    tbody.appendChild(row);
  });

  container.appendChild(table);
}

async function setupPage() {
  loadCurrentUser();
  await loadVehicles();
  renderFilterControls();
  renderAuthButtons();
  await renderVehicles();
  await renderReservationBooking();
  await displayReservationSummary();
  await renderDashboard();
  setupContactForm();

  document.querySelectorAll('#loginButton').forEach(button => {
    button.addEventListener('click', () => openAuthModal('login'));
  });
  document.querySelectorAll('#registerButton').forEach(button => {
    button.addEventListener('click', () => openAuthModal('register'));
  });
}

window.addEventListener('load', setupPage);

window.addEventListener("load", () => {
  showAdminButton();
});