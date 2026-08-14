# HappyTails Backend - Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Step-by-Step Setup

### 1. Install Dependencies
```bash
cd happytails_backend
npm install
```

### 2. Configure Environment Variables
```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Edit `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/happytails
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Or start mongod manually
mongod
```

### 4. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start on: `http://localhost:5000`

### 5. Test the API
Open your browser or use Postman:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "HappyTails API is running",
  "timestamp": "2025-04-17T10:30:00.000Z"
}
```

## Creating Your First Admin User

### Option 1: Using Postman/Insomnia

1. **Register a user:**
```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "fullName": "Admin User",
  "email": "admin@happytails.com",
  "password": "admin123",
  "confirmPassword": "admin123",
  "role": "admin"
}
```

2. **Login and get token:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@happytails.com",
  "password": "admin123"
}
```

Save the token from the response.

### Option 2: Using MongoDB Shell

```bash
mongo
use happytails

# Insert admin user (password is hashed: "admin123")
db.users.insertOne({
  fullName: "Admin User",
  email: "admin@happytails.com",
  password: "$2a$10$YourHashedPasswordHere",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Testing API Endpoints

### 1. Get All Pets (Public)
```bash
GET http://localhost:5000/api/pets
```

### 2. Add a New Pet (Admin Only)
```bash
POST http://localhost:5000/api/pets
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Buddy",
  "breed": "Golden Retriever",
  "type": "dog",
  "age": "2 years",
  "location": "Hyderabad",
  "image": "https://example.com/buddy.jpg",
  "description": "Friendly and playful dog",
  "gender": "male",
  "vaccinated": true
}
```

### 3. Book an Appointment (Authenticated User)
```bash
POST http://localhost:5000/api/appointments
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "vetName": "Dr. Priya Sharma",
  "vetId": "DOCTOR_ID_HERE",
  "date": "2025-04-25",
  "timeSlot": "10:00 AM",
  "ownerName": "John Doe",
  "petName": "Max",
  "petType": "Dog",
  "contactNumber": "+91 9123456789",
  "reason": "Regular checkup"
}
```

### 4. Submit Adoption Application (Authenticated User)
```bash
POST http://localhost:5000/api/adoption/apply
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "petId": "PET_ID_HERE",
  "fullName": "John Doe",
  "addressLine1": "123 Main Street",
  "phone": "+91 9123456789",
  "email": "john@example.com",
  "occupation": "Software Engineer",
  "livingSituation": "Family",
  "familyApproval": "Yes",
  "houseType": "Own",
  "priorPetExperience": "Yes",
  "dailyWalkCommitment": "2-4 hours",
  "hoursPetAlone": "2-6 hours",
  "backupCaretaker": "Jane Doe",
  "adoptionReason": "I want to provide a loving home",
  "financialReadiness": "Yes",
  "vetAccess": "Yes",
  "agreeToCare": true
}
```

## Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution:** 
- Make sure MongoDB is running
- Check MONGODB_URI in .env file
- For MongoDB Atlas, use your cluster connection string

### Issue: Port Already in Use
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change PORT in .env to different port (e.g., 5001)
```

### Issue: JWT Token Invalid
**Solution:**
- Make sure JWT_SECRET is set in .env
- Token might be expired - login again
- Check Authorization header format: `Bearer <token>`

### Issue: Cannot Register Admin User
**Solution:**
- Only existing admins can create new admins
- First admin must be created directly in database or allow role in signup temporarily

## Integrating with Frontend

Update your frontend `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Example API call in React:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Login
const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  
  return data;
};

// Get pets with token
const getPets = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/pets`, {
    headers: { 
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

## Next Steps

1. ✅ Backend is running
2. ⬜ Connect frontend to backend APIs
3. ⬜ Add sample data (pets, doctors)
4. ⬜ Test all user flows
5. ⬜ Deploy to production

## Useful Commands

```bash
# View MongoDB databases
mongo
show dbs
use happytails
show collections
db.users.find()
db.pets.find()

# Clear all data (CAUTION!)
db.dropDatabase()

# Check server logs
npm run dev

# Install new package
npm install package-name

# Update packages
npm update
```

## API Documentation

See [README.md](./README.md) for complete API documentation with all endpoints, request/response formats, and authentication details.

---

**Happy Coding! 🐾**
