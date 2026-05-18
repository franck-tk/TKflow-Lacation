const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// File upload configuration
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

// Data files
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const RESERVATIONS_FILE = path.join(__dirname, 'data', 'reservations.json');
const VEHICLES_FILE = path.join(__dirname, 'data', 'vehicles.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Helper functions
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

// Initialize vehicles data
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
    { brand: 'Peugeot', model: '308', category: 'Compact', basePrice: 50, seats: 5, luggage: 3, fuel: 'Diesel', image: '', description: 'Efficient compact car with a premium interior and agile handling.' },
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

// API Routes

// Get all vehicles
app.get('/api/vehicles', (req, res) => {
  const vehicles = readData(VEHICLES_FILE);
  res.json(vehicles);
});

// Get current user (from session - simplified)
app.get('/api/user', (req, res) => {
  // In a real app, this would use sessions/cookies
  res.json(null);
});

// Register user
app.post('/api/register', upload.fields([
  { name: 'cniFront', maxCount: 1 },
  { name: 'cniBack', maxCount: 1 },
  { name: 'portrait', maxCount: 1 }
]), (req, res) => {
  const { name, phone, email, password } = req.body;
  const users = readData(USERS_FILE);

  if (users.some(user => user.email === email || user.phone === phone)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: uuidv4(),
    username: name,
    phone,
    email,
    password,
    googleAuth: false,
    appleAuth: false,
    cniFront: req.files.cniFront ? req.files.cniFront[0].filename : '',
    cniBack: req.files.cniBack ? req.files.cniBack[0].filename : '',
    portrait: req.files.portrait ? req.files.portrait[0].filename : '',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeData(USERS_FILE, users);
  res.json({ user: newUser, message: 'Registration successful' });
});

// Login user
app.post('/api/login', (req, res) => {
  const { login, password } = req.body;
  const users = readData(USERS_FILE);
  const user = users.find(u => (u.email === login || u.phone === login) && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ user, message: 'Login successful' });
});

// Social auth (simulated)
app.post('/api/auth/:provider', (req, res) => {
  const { provider } = req.params;
  const users = readData(USERS_FILE);
  let user = users[0]; // Simplified - use first user

  if (!user) {
    user = {
      id: uuidv4(),
      username: `${provider} user`,
      phone: '',
      email: `${provider}@tkflow.com`,
      password: '',
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

  res.json({ user, message: `Authenticated with ${provider}` });
});

// Get reservations for user
app.get('/api/reservations/:userId', (req, res) => {
  const { userId } = req.params;
  const reservations = readData(RESERVATIONS_FILE);
  const userReservations = reservations.filter(r => r.userId === userId);
  res.json(userReservations);
});

// Create reservation
app.post('/api/reservations', (req, res) => {
  const { userId, vehicleId, startDate, endDate, paymentMethod } = req.body;
  const reservations = readData(RESERVATIONS_FILE);
  const vehicles = readData(VEHICLES_FILE);

  // Check if vehicle is available
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
  res.json({ reservation, message: 'Reservation created successfully' });
});

// Contact form
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  // In a real app, this would send an email
  console.log('Contact form submission:', { name, email, message });
  res.json({ message: 'Message sent successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`TKflow server running on http://localhost:${PORT}`);
});