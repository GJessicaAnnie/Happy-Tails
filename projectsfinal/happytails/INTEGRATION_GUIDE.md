# Frontend-Backend Integration Guide

## ✅ Already Integrated Pages:
1. ✅ Login Page - Connected to `/api/auth/login`
2. ✅ SignUp Page - Connected to `/api/auth/signup`
3. ✅ FindPet Page - Connected to `/api/pets`
4. ✅ Doctors Page - Connected to `/api/users/doctors`
5. ✅ Contact Page - Connected to `/api/contact`

## 🔧 Remaining Integrations:

### 1. BookAppointment Page

**Add these imports at the top:**
```javascript
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../services/appointmentService';
import { userService } from '../services/userService';
```

**Update the component:**
```javascript
function BookAppointment() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    vetName: '',
    vetId: '',
    date: '',
    timeSlot: '',
    ownerName: '',
    petName: '',
    petType: 'Dog',
    contactNumber: '',
    reason: ''
  });

  const [doctors, setDoctors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Fetch doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await userService.getDoctors();
      if (response.success) {
        setDoctors(response.data.doctors);
        if (response.data.doctors.length > 0) {
          setFormData(prev => ({
            ...prev,
            vetName: response.data.doctors[0].fullName,
            vetId: response.data.doctors[0]._id
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  // Fetch booked slots when date or vet changes
  useEffect(() => {
    if (formData.date && formData.vetId) {
      fetchBookedSlots();
      generateAvailableSlots();
    }
  }, [formData.date, formData.vetId]);

  const fetchBookedSlots = async () => {
    try {
      const response = await appointmentService.getBookedSlots(
        formData.vetId,
        formData.date
      );
      if (response.success) {
        setBookedSlots(response.data.bookedSlots);
      }
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  };

  const generateAvailableSlots = () => {
    const doctor = doctors.find(d => d._id === formData.vetId);
    if (!doctor || !doctor.workingHours) return;

    const { start, end } = doctor.workingHours;
    const slots = [];
    
    for (let hour = start; hour < end; hour++) {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      slots.push(`${displayHour}:00 ${period}`);
    }

    setAvailableSlots(slots);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'vetName') {
      const doctor = doctors.find(d => d.fullName === value);
      setFormData({
        ...formData,
        vetName: value,
        vetId: doctor?._id || ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!formData.date || !formData.timeSlot || !formData.ownerName || 
        !formData.petName || !formData.contactNumber || !formData.reason) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await appointmentService.bookAppointment(formData);
      
      if (response.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            vetName: doctors[0]?.fullName || '',
            vetId: doctors[0]?._id || '',
            date: '',
            timeSlot: '',
            ownerName: user?.fullName || '',
            petName: '',
            petType: 'Dog',
            contactNumber: '',
            reason: ''
          });
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const isSlotBooked = (slot) => {
    return bookedSlots.includes(slot);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Pre-fill owner name if user is logged in
  useEffect(() => {
    if (user && user.fullName) {
      setFormData(prev => ({
        ...prev,
        ownerName: user.fullName
      }));
    }
  }, [user]);
```

**Update the form JSX:**
```javascript
{/* Veterinarian Dropdown */}
<select
  id="vetName"
  name="vetName"
  value={formData.vetName}
  onChange={handleChange}
  className="booking-form__select"
  required
>
  {doctors.map(doctor => (
    <option key={doctor._id} value={doctor.fullName}>
      {doctor.fullName} - {doctor.specialization}
    </option>
  ))}
</select>

{/* Add error display */}
{error && <div className="booking-error">{error}</div>}

{/* Update submit button */}
<button 
  type="submit" 
  className="button booking-form__submit"
  disabled={loading}
>
  {loading ? 'Booking...' : 'Book Appointment'}
</button>
```

---

### 2. AdoptionForm Page

**Add these imports:**
```javascript
import { useAuth } from '../context/AuthContext';
import { adoptionService } from '../services/adoptionService';
```

**Update the handleSubmit function:**
```javascript
function AdoptionForm() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (validateStep(3)) {
      try {
        const applicationData = {
          petId,
          ...formData
        };

        const response = await adoptionService.submitApplication(applicationData);
        
        if (response.success) {
          setIsSubmitted(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to submit application');
      }
    }
  };

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email
      }));
    }
  }, [user]);
```

---

### 3. Navbar Update with Auth State

**Update Navbar.jsx:**
```javascript
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          🐾 HappyTails
        </Link>

        <div className="navbar__links">
          <Link to="/" className="navbar__link">Home</Link>
          <Link to="/find-pet" className="navbar__link">Find Pet</Link>
          <Link to="/rescue-care" className="navbar__link">Rescue Care</Link>
          <Link to="/doctors" className="navbar__link">Doctors</Link>
          <Link to="/contact" className="navbar__link">Contact</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/book-appointment" className="navbar__link">
                Book Appointment
              </Link>
              <div className="navbar__user-menu">
                <span className="navbar__user-name">
                  Hi, {user?.fullName}
                </span>
                <button onClick={handleLogout} className="navbar__logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__link">Login</Link>
              <Link to="/signup" className="navbar__link navbar__link--accent">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
```

---

### 4. Add Environment Variable

Create `.env` file in the frontend root (happytails folder):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Testing the Integration

### 1. Start Backend Server:
```bash
cd happytails_backend
npm run dev
```

### 2. Start Frontend:
```bash
cd happytails
npm run dev
```

### 3. Test Flow:
1. **Sign Up** - Create a new account
2. **Login** - Login with credentials
3. **Browse Pets** - View pets from database
4. **View Doctors** - See available veterinarians
5. **Book Appointment** - Schedule a vet visit
6. **Adopt Pet** - Submit adoption application
7. **Contact** - Send a message

---

## 📝 API Endpoints Being Used:

| Page | Endpoint | Method |
|------|----------|--------|
| Login | `/api/auth/login` | POST |
| SignUp | `/api/auth/signup` | POST |
| FindPet | `/api/pets` | GET |
| Doctors | `/api/users/doctors` | GET |
| BookAppointment | `/api/appointments` | POST |
| AdoptionForm | `/api/adoption/apply` | POST |
| Contact | `/api/contact` | POST |

---

## 🔑 Authentication Flow:

1. User logs in → Token saved in localStorage
2. API interceptor adds token to all requests
3. Protected routes check authentication
4. Logout clears token and user data

---

## ⚠️ Important Notes:

1. **CORS is configured** in backend to allow frontend requests
2. **Token auto-attaches** to all API requests via axios interceptor
3. **401 errors** automatically redirect to login page
4. **Loading states** added for better UX
5. **Error handling** displays user-friendly messages

---

## 🎯 Next Steps:

1. Add some sample pets to the database using Postman or MongoDB Compass
2. Create a doctor user with role "doctor"
3. Test all user flows
4. Add admin dashboard for managing content
5. Add user profile page
6. Add appointment history page
7. Add adoption application tracking

---

## 🐛 Troubleshooting:

**Issue: CORS Error**
- Check backend CORS configuration in server.js
- Ensure FRONTEND_URL in .env matches your frontend URL

**Issue: Token Not Working**
- Check if token is saved in localStorage
- Verify JWT_SECRET matches in backend .env

**Issue: API Not Responding**
- Ensure backend server is running on port 5000
- Check VITE_API_URL in frontend .env
- Check browser console for errors

**Issue: Can't Login**
- Verify user exists in database
- Check if password is hashed correctly
- Check backend logs for errors
