# TKflow Car Rental Website

A complete car rental website with backend simulation, built with HTML, CSS, JavaScript, and Node.js.

## Features

- **User Authentication**: Register/login with phone, email, or social auth (Google, Face ID)
- **Identity Verification**: Upload CNI front/back and portrait for security
- **Vehicle Catalog**: Browse 10 different vehicle types with GPS tracking
- **Reservation System**: Book vehicles with date selection and automatic pricing
- **Payment Integration**: Support for Orange Money and MTN Mobile Money
- **Dashboard**: User profile management and reservation history
- **File Storage**: Backend simulation with JSON file persistence
- **Responsive Design**: Modern, attractive UI that works on all devices

## Project Structure

```
tkflow-car-rental/
├── index.html              # Home page
├── about.html              # About page
├── vehicules.html          # Vehicule catalog
├── reservations.html       # User reservations
├── dashboard.html          # User dashboard
├── contact.html            # Contact form
├── server.js               # Node.js backend server
├── package.json            # Dependencies
├── assets/
│   ├── css/
│   │   └── styles.css      # Main stylesheet
│   ├── js/
│   │   └── script.js       # Frontend JavaScript
│   └── images/             # Static images
├── data/                   # JSON data files (created automatically)
├── uploads/                # User uploaded files (created automatically)
└── node_modules/           # Dependencies (after npm install)
```

## Installation & Setup

1. **Clone or download** the project files

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/vehicles` - Get all available vehicles
- `POST /api/register` - Register new user (with file uploads)
- `POST /api/login` - User login
- `POST /api/auth/:provider` - Social authentication
- `GET /api/reservations/:userId` - Get user reservations
- `POST /api/reservations` - Create new reservation
- `POST /api/contact` - Send contact message

## Data Storage

- **Users**: Stored in `data/users.json`
- **Reservations**: Stored in `data/reservations.json`
- **Vehicles**: Stored in `data/vehicles.json`
- **Uploads**: User files stored in `uploads/` directory

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **File Handling**: Multer for uploads
- **Data Storage**: JSON files (simulated database)
- **Styling**: Custom CSS with modern design patterns

## Security Features

- Identity document verification (CNI + portrait)
- GPS tracking on all vehicles
- Secure reservation system
- File upload validation
- User authentication required for bookings

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

The project uses a simple file-based backend simulation. In production, you would replace the JSON file storage with a proper database (MongoDB, PostgreSQL, etc.) and implement real payment processing.

## License

This project is for educational purposes. Modify and use as needed.