const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const RESERVATIONS_FILE = path.join(DATA_DIR, 'reservations.json');
const VEHICLES_FILE = path.join(DATA_DIR, 'vehicles.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function createMailTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  return nodemailer.createTransport({ jsonTransport: true });
}

async function sendReservationConfirmationEmail(to, reservation, vehicle, user) {
  const startDate = new Date(reservation.startDate).toLocaleDateString('fr-FR');
  const endDate = new Date(reservation.endDate).toLocaleDateString('fr-FR');
  const subject = `Confirmation de réservation TKflow - ${vehicle.name}`;
  const html = `
    <h2>Confirmation de réservation TKflow</h2>
    <p>Bonjour ${user.name || user.email || 'client'},</p>
    <p>Votre réservation pour <strong>${vehicle.name}</strong> a été confirmée.</p>
    <ul>
      <li><strong>Début :</strong> ${startDate}</li>
      <li><strong>Fin :</strong> ${endDate}</li>
      <li><strong>Durée :</strong> ${reservation.duration} jour(s)</li>
      <li><strong>Montant total :</strong> ${reservation.total} €</li>
      <li><strong>Moyen de paiement :</strong> ${reservation.paymentMethod}</li>
    </ul>
    <p>Merci d'avoir réservé avec TKflow. Nous sommes impatients de vous servir.</p>
    <p>Cordialement,<br>Équipe TKflow</p>
  `;

  const transporter = await createMailTransporter();
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@tkflow.com',
    to,
    subject,
    html
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

function readData(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

function writeData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

function createVehicleTemplates() {
  return [
    { brand: 'Toyota', model: 'Corolla', category: 'Sedan', basePrice: 55, seats: 5, luggage: 3, fuel: 'Petrol', image: '', description: 'Reliable compact sedan for city and highway travel.' },
    { brand: 'Honda', model: 'Civic', category: 'Sedan', basePrice: 60, seats: 5, luggage: 3, fuel: 'Petrol', image: '', description: 'Comfortable and modern sedan with excellent fuel economy.' },
    { brand: 'Nissan', model: 'Sentra', category: 'Sedan', basePrice: 52, seats: 5, luggage: 3, fuel: 'Petrol', image: '', description: 'Efficient sedan built for everyday driving and comfort.' },
    { brand: 'BMW', model: '3 Series', category: 'Luxury Sedan', basePrice: 110, seats: 5, luggage: 3, fuel: 'Petrol', image: '', description: 'Premium business sedan with dynamic performance and style.' },
    { brand: 'Mercedes', model: 'C-Class', category: 'Luxury Sedan', basePrice: 120, seats: 5, luggage: 3, fuel: 'Diesel', image: '', description: 'Sophisticated luxury sedan with advanced comfort features.' },
    { brand: 'Ford', model: 'Explorer', category: 'SUV', basePrice: 105, seats: 7, luggage: 5, fuel: 'Petrol', image: '', description: 'Spacious SUV ideal for family trips and weekend adventures.' },
    { brand: 'Jeep', model: 'Grand Cherokee', category: 'SUV', basePrice: 115, seats: 7, luggage: 5, fuel: 'Diesel', image: '', description: 'Rugged SUV built for comfort and off-road capability.' },
    { brand: 'Tesla', model: 'Model 3', category: 'Electric', basePrice: 130, seats: 5, luggage: 3, fuel: 'Electric', image: '', description: 'Electric sedan with advanced autopilot and premium interior.' },
    { brand: 'Renault', model: 'Clio', category: 'Compact', basePrice: 48, seats: 5, luggage: 2, fuel: 'Petrol', image: '', description: 'Compact hatchback perfect for city driving and easy parking.' },
    { brand: 'Peugeot', model: '308', category: 'Compact', basePrice: 50, seats: 5, luggage: 3, fuel: 'Diesel', image: '', description: 'Efficient compact car with a premium interior and agile handling.' }
  ];
}

function generateInitialVehicles() {
  const templates = createVehicleTemplates();
  const variants = ['Standard', 'Premium', 'Executive', 'Sport', 'Touring'];
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
        image: template.image,
        description: template.description,
      });
    });
  });

  return vehicles;
}

const initialVehicles = generateInitialVehicles();
const existingVehicles = readData(VEHICLES_FILE);
if (!existingVehicles.length || existingVehicles.length !== initialVehicles.length) {
  writeData(VEHICLES_FILE, initialVehicles);
}

const existingUsers = readData(USERS_FILE);
const hasSuperadmin = existingUsers.some(user => user.role === 'superadmin');
if (!hasSuperadmin) {
  existingUsers.push({
    id: uuidv4(),
    username: 'superadmin',
    phone: '',
    email: 'admin@tkflow.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'superadmin',
    googleAuth: false,
    appleAuth: false,
    cniFront: '',
    cniBack: '',
    portrait: '',
    createdAt: new Date().toISOString()
  });
  writeData(USERS_FILE, existingUsers);
} else {
  let changed = false;
  existingUsers.forEach(user => {
    if (user.password && !user.password.startsWith('$2')) {
      user.password = bcrypt.hashSync(user.password, 10);
      changed = true;
    }
  });
  if (changed) writeData(USERS_FILE, existingUsers);
}

function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

app.get('/api/vehicles', (req, res) => {
  res.json(readData(VEHICLES_FILE));
});

app.post('/api/vehicles', upload.single('image'), (req, res) => {
  const vehicles = readData(VEHICLES_FILE);
  const vehicle = {
    id: uuidv4(),
    name: req.body.name,
    category: req.body.category,
    pricePerDay: Number(req.body.pricePerDay) || 0,
    seats: Number(req.body.seats) || 0,
    luggage: Number(req.body.luggage) || 3,
    fuel: req.body.fuel || 'Unknown',
    description: req.body.description || '',
    image: req.file ? `/uploads/${req.file.filename}` : req.body.image || ''
  };

  vehicles.push(vehicle);
  writeData(VEHICLES_FILE, vehicles);
  res.json(vehicle);
});

app.post('/api/register', upload.fields([
  { name: 'cniFront', maxCount: 1 },
  { name: 'cniBack', maxCount: 1 },
  { name: 'portrait', maxCount: 1 }
]), async (req, res) => {
  const { name, phone, email, password } = req.body;
  const users = readData(USERS_FILE);

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Username, email and password are required.' });
  }

  if (users.some(user => user.email === email || (phone && user.phone === phone))) {
    return res.status(400).json({ error: 'Email already used.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: uuidv4(),
    username: name,
    phone,
    email,
    password: hashedPassword,
    role: 'user',
    googleAuth: false,
    appleAuth: false,
    cniFront: req.files && req.files.cniFront ? req.files.cniFront[0].filename : '',
    cniBack: req.files && req.files.cniBack ? req.files.cniBack[0].filename : '',
    portrait: req.files && req.files.portrait ? req.files.portrait[0].filename : '',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeData(USERS_FILE, users);
  res.json({ user: sanitizeUser(newUser), message: 'Registration successful' });
});

app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  const users = readData(USERS_FILE);
  const user = users.find(u => u.email === login || u.phone === login);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  res.json({ user: sanitizeUser(user), message: 'Login successful' });
});

app.post('/api/users/upload-cni', upload.single('cni'), (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'User ID is required.' });
  const users = readData(USERS_FILE);
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return res.status(404).json({ error: 'User not found.' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
  users[idx] = {
    ...users[idx],
    cniFront: req.file.filename,
    profileComplete: !!(users[idx].cniNumber)
  };
  writeData(USERS_FILE, users);
  res.json({ success: true, filename: req.file.filename, user: sanitizeUser(users[idx]) });
});

app.post('/api/profile/complete', upload.fields([
  { name: 'cniFront', maxCount: 1 },
  { name: 'cniBack', maxCount: 1 },
  { name: 'portrait', maxCount: 1 }
]), async (req, res) => {
  const { userId, cniNumber } = req.body;
  if (!userId || !cniNumber) {
    return res.status(400).json({ error: 'User ID and CNI number are required.' });
  }
  const users = readData(USERS_FILE);
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }
  users[userIndex] = {
    ...users[userIndex],
    cniNumber,
    profileComplete: true,
    cniFront: req.files?.cniFront?.[0]?.filename || users[userIndex].cniFront || '',
    cniBack: req.files?.cniBack?.[0]?.filename || users[userIndex].cniBack || '',
    portrait: req.files?.portrait?.[0]?.filename || users[userIndex].portrait || ''
  };
  writeData(USERS_FILE, users);
  res.json({ user: sanitizeUser(users[userIndex]) });
});

app.post('/api/auth/:provider', (req, res) => {
  const { provider } = req.params;
  const users = readData(USERS_FILE);
  let user = users[0];

  if (!user) {
    user = {
      id: uuidv4(),
      username: `${provider} user`,
      phone: '',
      email: `${provider}@tkflow.com`,
      password: '',
      role: 'user',
      googleAuth: provider === 'google',
      appleAuth: provider === 'apple',
      cniFront: '',
      cniBack: '',
      portrait: '',
      createdAt: new Date().toISOString()
    };
    users.push(user);
    writeData(USERS_FILE, users);
  }

  res.json({ user: sanitizeUser(user), message: `Authenticated with ${provider}` });
});

app.get('/api/reservations/:userId', (req, res) => {
  const { userId } = req.params;
  const reservations = readData(RESERVATIONS_FILE);
  const userReservations = reservations.filter(r => r.userId === userId);
  res.json(userReservations);
});

app.post('/api/reservations', async (req, res) => {
  const { userId, vehicleId, startDate, endDate, paymentMethod } = req.body;
  const reservations = readData(RESERVATIONS_FILE);
  const vehicles = readData(VEHICLES_FILE);

  const isReserved = reservations.some(r =>
    r.vehicleId === vehicleId &&
    r.status === 'confirmed' &&
    new Date(r.endDate) > new Date(startDate)
  );

  if (isReserved) {
    return res.status(400).json({ error: 'Vehicle not available for selected dates' });
  }

  const vehicle = vehicles.find(v => v.id === vehicleId);
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  const total = duration * vehicle.pricePerDay;

  const reservation = {
    id: uuidv4(),
    userId,
    vehicleId,
    vehicleName: vehicle.name,
    startDate,
    endDate,
    duration,
    unitPrice: vehicle.pricePerDay,
    total,
    paymentMethod,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  reservations.push(reservation);
  writeData(RESERVATIONS_FILE, reservations);

  const users = readData(USERS_FILE);
  const user = users.find(u => u.id === userId);
  let emailNotification = { sent: false, message: 'No email was sent.' };

  if (user && user.email) {
    try {
      const info = await sendReservationConfirmationEmail(user.email, reservation, vehicle, user);
      emailNotification = { sent: true, info: info.messageId || info.response || 'sent' };
      console.log('Reservation confirmation email sent to', user.email, emailNotification.info);
    } catch (emailError) {
      console.error('Failed to send reservation email:', emailError);
      emailNotification = { sent: false, message: emailError.message || 'Email send failure' };
    }
  } else {
    console.warn('Reservation created without a user email address.');
    emailNotification = { sent: false, message: 'User email address is missing.' };
  }

  res.json({ reservation, message: 'Reservation created successfully', emailNotification });
});

app.get('/api/admin/users', (req, res) => {
  const actorId = req.query.actorId;
  const users = readData(USERS_FILE);
  const actor = users.find(u => u.id === actorId);

  if (!actor || actor.role !== 'superadmin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const safeUsers = users.map(user => sanitizeUser(user));
  res.json(safeUsers);
});

app.post('/api/admin/users/:userId/role', (req, res) => {
  const { userId } = req.params;
  const { actorId, role } = req.body;
  const users = readData(USERS_FILE);
  const actor = users.find(u => u.id === actorId);
  const target = users.find(u => u.id === userId);

  if (!actor || actor.role !== 'superadmin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (!target) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (actor.id === target.id) {
    return res.status(400).json({ error: 'Superadmin cannot change own role' });
  }
  if (target.role === 'superadmin') {
    return res.status(403).json({ error: 'Cannot change another superadmin' });
  }
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  target.role = role;
  writeData(USERS_FILE, users);
  res.json({ user: sanitizeUser(target), message: 'Role updated successfully' });
});

app.delete('/api/admin/users/:userId', (req, res) => {
  const { userId } = req.params;
  const { actorId } = req.body;
  const users = readData(USERS_FILE);
  const actor = users.find(u => u.id === actorId);
  const target = users.find(u => u.id === userId);

  if (!actor || actor.role !== 'superadmin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (!target) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (actor.id === target.id) {
    return res.status(400).json({ error: 'Superadmin cannot delete own account' });
  }
  if (target.role === 'superadmin') {
    return res.status(403).json({ error: 'Cannot delete another superadmin' });
  }

  const updatedUsers = users.filter(u => u.id !== userId);
  writeData(USERS_FILE, updatedUsers);

  const reservations = readData(RESERVATIONS_FILE).filter(r => r.userId !== userId);
  writeData(RESERVATIONS_FILE, reservations);

  res.json({ message: 'User deleted successfully' });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact form submission:', { name, email, message });
  res.json({ message: 'Message sent successfully' });
});

app.listen(PORT, () => {
  console.log(`TKflow server running on http://localhost:${PORT}`);
});

if (process.env.NODE_ENV === 'production') {
  require('./keepalive');
}