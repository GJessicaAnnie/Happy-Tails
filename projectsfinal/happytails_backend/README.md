# HappyTails Backend API

Backend server for the HappyTails pet adoption and veterinary services platform.

## 🚀 Features

- **User Authentication** - JWT-based authentication with role-based access control
- **Three User Roles** - Customer, Doctor, and Admin
- **Pet Management** - CRUD operations for pet adoption listings
- **Appointment Booking** - Veterinary appointment scheduling system
- **Adoption Applications** - Multi-step adoption application process
- **Contact System** - Message management and tracking
- **Role-Based Authorization** - Different access levels for different user types

## 📁 Project Structure

```
happytails_backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   ├── petController.js     # Pet CRUD operations
│   ├── appointmentController.js  # Appointment booking
│   ├── adoptionController.js     # Adoption applications
│   └── contactController.js      # Contact messages
├── middleware/
│   ├── auth.js              # JWT verification & role authorization
│   └── error.js             # Error handling utilities
├── models/
│   ├── User.js              # User schema (Customer, Doctor, Admin)
│   ├── Pet.js               # Pet schema
│   ├── Appointment.js       # Appointment schema
│   ├── AdoptionApplication.js    # Adoption application schema
│   └── ContactMessage.js    # Contact message schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── userRoutes.js        # User endpoints
│   ├── petRoutes.js         # Pet endpoints
│   ├── appointmentRoutes.js # Appointment endpoints
│   ├── adoptionRoutes.js    # Adoption endpoints
│   └── contactRoutes.js     # Contact endpoints
├── .env.example             # Environment variables template
├── .gitignore
├── server.js                # Main entry point
└── package.json
```

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Installation

1. **Navigate to backend directory**
   ```bash
   cd happytails_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   copy .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/happytails
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔐 User Roles

### Customer (Default)
- Browse and search pets
- Submit adoption applications
- Book vet appointments
- View own applications and appointments
- Send contact messages

### Doctor
- View own appointments
- Update appointment status
- Manage availability

### Admin
- Full CRUD operations on pets
- Manage all users
- View and manage all applications
- View and manage all appointments
- Manage contact messages
- View statistics

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/signup           - Register new user
POST   /api/auth/login            - Login user
GET    /api/auth/me               - Get current user (Protected)
PUT    /api/auth/updatepassword   - Update password (Protected)
```

### Users
```
GET    /api/users/doctors         - Get all doctors (Public)
GET    /api/users                 - Get all users (Admin)
GET    /api/users/:id             - Get user by ID (Protected)
PUT    /api/users/:id             - Update user (Protected)
DELETE /api/users/:id             - Delete user (Admin)
```

### Pets
```
GET    /api/pets                  - Get all pets (Public, with filters)
GET    /api/pets/locations        - Get available locations (Public)
GET    /api/pets/:id              - Get single pet (Public)
POST   /api/pets                  - Create pet (Admin)
PUT    /api/pets/:id              - Update pet (Admin)
DELETE /api/pets/:id              - Delete pet (Admin)
```

**Query Parameters for GET /api/pets:**
- `type` - Filter by pet type (dog, cat, bird, rabbit, other)
- `location` - Filter by location
- `status` - Filter by status (available, pending, adopted)
- `search` - Search by name or breed
- `age` - Filter by age (young, adult, senior)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Appointments
```
GET    /api/appointments/booked-slots        - Get booked slots (Public)
GET    /api/appointments/my                  - Get user's appointments (Protected)
GET    /api/appointments/doctor/:doctorId    - Get doctor's appointments (Doctor/Admin)
GET    /api/appointments                     - Get all appointments (Admin)
GET    /api/appointments/:id                 - Get single appointment (Protected)
POST   /api/appointments                     - Book appointment (Protected)
PUT    /api/appointments/:id/status          - Update status (Protected)
DELETE /api/appointments/:id                 - Cancel appointment (Protected)
```

### Adoption Applications
```
GET    /api/adoption/stats                      - Get statistics (Admin)
GET    /api/adoption/my-applications            - Get user's applications (Protected)
GET    /api/adoption/applications               - Get all applications (Admin)
GET    /api/adoption/applications/:id           - Get single application (Protected)
POST   /api/adoption/apply                      - Submit application (Protected)
PUT    /api/adoption/applications/:id           - Update status (Admin)
```

### Contact Messages
```
GET    /api/contact/stats           - Get message statistics (Admin)
GET    /api/contact                 - Get all messages (Admin)
GET    /api/contact/:id             - Get single message (Admin)
POST   /api/contact                 - Submit message (Public)
PUT    /api/contact/:id/status      - Update status (Admin)
DELETE /api/contact/:id             - Delete message (Admin)
```

## 🔑 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_token_here>
```

## 📝 Request/Response Examples

### Register User
**Request:**
```json
POST /api/auth/signup
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "customer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Book Appointment
**Request:**
```json
POST /api/appointments
Authorization: Bearer <token>
{
  "vetName": "Dr. Priya Sharma",
  "vetId": "...",
  "date": "2025-04-20",
  "timeSlot": "10:00 AM",
  "ownerName": "John Doe",
  "petName": "Max",
  "petType": "Dog",
  "contactNumber": "+91 9123456789",
  "reason": "Regular checkup"
}
```

### Submit Adoption Application
**Request:**
```json
POST /api/adoption/apply
Authorization: Bearer <token>
{
  "petId": "...",
  "fullName": "John Doe",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apt 4B",
  "phone": "+91 9123456789",
  "email": "john@example.com",
  "occupation": "Software Engineer",
  "livingSituation": "Family",
  "familyApproval": "Yes",
  "houseType": "Own",
  "landlordPermission": "Yes",
  "priorPetExperience": "Yes",
  "dailyWalkCommitment": "2-4 hours",
  "hoursPetAlone": "2-6 hours",
  "backupCaretaker": "Jane Doe - +91 9876543210",
  "adoptionReason": "I want to provide a loving home...",
  "financialReadiness": "Yes",
  "vetAccess": "Yes",
  "agreeToCare": true
}
```

## 🗄️ Database Models

### User
- fullName, email, password (hashed)
- role: customer | doctor | admin
- Doctor fields: specialization, experience, rating, isAvailable, workingHours
- phone, address, profileImage
- Timestamps

### Pet
- name, breed, type, age, location
- image, description, gender
- vaccinated, status: available | pending | adopted
- addedBy (ref: User)
- Timestamps

### Appointment
- vetName, vetId (ref: User), userId (ref: User)
- date, timeSlot
- ownerName, petName, petType, contactNumber, reason
- status: pending | confirmed | cancelled | completed
- notes
- Timestamps

### AdoptionApplication
- petId (ref: Pet), userId (ref: User)
- Personal details, living situation, pet care readiness
- status: pending | under_review | approved | rejected
- reviewNotes, reviewedBy (ref: User), reviewedAt
- Timestamps

### ContactMessage
- name, email, subject, message
- status: unread | read | replied
- repliedAt, repliedBy (ref: User)
- Timestamps

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based authorization
- Input validation
- Error handling
- CORS configuration
- Environment variable protection

## 📊 Health Check

```
GET /api/health
```

Response:
```json
{
  "status": "OK",
  "message": "HappyTails API is running",
  "timestamp": "2025-04-17T10:30:00.000Z"
}
```

## 🧪 Testing with Postman

1. Import the API endpoints
2. Set base URL: `http://localhost:5000`
3. For protected routes, add Authorization header with Bearer token
4. Test public routes without authentication

## 📈 Future Enhancements

- Email notifications for appointments and applications
- File upload for pet images
- Payment integration
- Real-time chat support
- Push notifications
- Advanced search and filtering
- Analytics dashboard
- Export reports

## 🤝 Support

For issues or questions, please contact the development team.

## 📄 License

ISC
