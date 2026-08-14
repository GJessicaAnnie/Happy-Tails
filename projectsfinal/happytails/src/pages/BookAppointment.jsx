import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { userService } from '../services/userService';
import { appointmentService } from '../services/appointmentService';
import './BookAppointment.css';

function BookAppointment() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [doctors, setDoctors] = useState([]);
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

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Fetch doctors on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchDoctors();
  }, [isAuthenticated, navigate]);

  // Pre-fill owner name
  useEffect(() => {
    if (user && user.fullName) {
      setFormData(prev => ({ ...prev, ownerName: user.fullName }));
    }
  }, [user]);

  // Generate time slots and fetch booked slots
  useEffect(() => {
    if (formData.date && formData.vetId) {
      generateTimeSlots();
      fetchBookedSlots();
    }
  }, [formData.date, formData.vetId]);

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

  const formatTimeSlot = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const generateTimeSlots = () => {
    const selectedDoctor = doctors.find(d => d._id === formData.vetId);
    if (!selectedDoctor) return;

    const startHour = selectedDoctor.workingHours?.start || 9;
    const endHour = selectedDoctor.workingHours?.end || 17;
    const slots = [];

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(formatTimeSlot(hour));
    }
    setAvailableSlots(slots);
  };

  const fetchBookedSlots = async () => {
    try {
      const response = await appointmentService.getBookedSlots(formData.vetId, formData.date);
      if (response.success) {
        setBookedSlots(response.data.bookedSlots);
      }
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSlotSelect = (slot) => {
    if (!bookedSlots.includes(slot)) {
      setFormData({
        ...formData,
        timeSlot: slot
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="booking-page">
      <Navbar />
      
      <main className="booking-main">
        <section className="booking-hero">
          <div className="booking-hero__content">
            <h1 className="booking-hero__title">Book Appointment</h1>
            <p className="booking-hero__subtitle">
              Schedule a consultation with our expert veterinarians
            </p>
          </div>
        </section>

        <section className="booking-content">
          <div className="booking-content__inner">
            <div className="booking-card">
              {submitted ? (
                <div className="booking-success">
                  <div className="booking-success__icon">✓</div>
                  <h2>Appointment Booked!</h2>
                  <p>Your appointment has been scheduled successfully.</p>
                  <div className="booking-success__details">
                    <p><strong>Vet:</strong> {formData.vetName}</p>
                    <p><strong>Date:</strong> {formData.date}</p>
                    <p><strong>Time:</strong> {formData.timeSlot}</p>
                  </div>
                </div>
              ) : (
                <form className="booking-form" onSubmit={handleSubmit}>
                  <h2 className="booking-form__title">Schedule Your Visit</h2>

                  {error && <div className="booking-error" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

                  {/* Veterinarian - Full Width */}
                  <div className="booking-form__group booking-form__group--full">
                    <label htmlFor="vetName" className="booking-form__label">
                      Veterinarian *
                    </label>
                    <select
                      id="vetName"
                      name="vetName"
                      value={formData.vetName}
                      onChange={(e) => {
                        const selectedDoctor = doctors.find(d => d.fullName === e.target.value);
                        setFormData({
                          ...formData,
                          vetName: e.target.value,
                          vetId: selectedDoctor?._id || ''
                        });
                      }}
                      className="booking-form__select"
                      required
                    >
                      <option value="">Select a Doctor</option>
                      {doctors.map(doctor => (
                        <option key={doctor._id} value={doctor.fullName}>
                          {doctor.fullName} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Two Column Layout */}
                  <div className="booking-form__grid">
                    {/* Date Picker */}
                    <div className="booking-form__group">
                      <label htmlFor="date" className="booking-form__label">
                        Appointment Date *
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={getMinDate()}
                        className="booking-form__input"
                        required
                      />
                    </div>

                    {/* Time Slots */}
                    {formData.date ? (
                      <div className="booking-form__group">
                        <label htmlFor="timeSlot" className="booking-form__label">
                          Time Slot *
                        </label>
                        <select
                          id="timeSlot"
                          name="timeSlot"
                          value={formData.timeSlot}
                          onChange={handleChange}
                          className="booking-form__select"
                          required
                        >
                          <option value="">Select a time</option>
                          {availableSlots.map((slot) => {
                            const booked = isSlotBooked(slot);
                            return (
                              <option key={slot} value={slot} disabled={booked}>
                                {slot} {booked ? '(Booked)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : (
                      <div className="booking-form__group">
                        <label htmlFor="timeSlot" className="booking-form__label">
                          Time Slot *
                        </label>
                        <select
                          id="timeSlot"
                          name="timeSlot"
                          value=""
                          className="booking-form__select"
                          disabled
                          required
                        >
                          <option value="">Select date first</option>
                        </select>
                      </div>
                    )}

                    {/* Your Name */}
                    <div className="booking-form__group">
                      <label htmlFor="ownerName" className="booking-form__label">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="ownerName"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        className="booking-form__input"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    {/* Pet Name */}
                    <div className="booking-form__group">
                      <label htmlFor="petName" className="booking-form__label">
                        Pet Name *
                      </label>
                      <input
                        type="text"
                        id="petName"
                        name="petName"
                        value={formData.petName}
                        onChange={handleChange}
                        className="booking-form__input"
                        placeholder="Max"
                        required
                      />
                    </div>

                    {/* Pet Type */}
                    <div className="booking-form__group">
                      <label htmlFor="petType" className="booking-form__label">
                        Pet Type *
                      </label>
                      <select
                        id="petType"
                        name="petType"
                        value={formData.petType}
                        onChange={handleChange}
                        className="booking-form__select"
                        required
                      >
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                        <option value="Rabbit">Rabbit</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Contact Number */}
                    <div className="booking-form__group">
                      <label htmlFor="contactNumber" className="booking-form__label">
                        Contact Number *
                      </label>
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="booking-form__input"
                        placeholder="+91 91234 56789"
                        required
                      />
                    </div>
                  </div>

                  {/* Reason - Full Width */}
                  <div className="booking-form__group booking-form__group--full">
                    <label htmlFor="reason" className="booking-form__label">
                      Reason for Visit *
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      className="booking-form__textarea"
                      placeholder="Describe the reason for your visit..."
                      rows="4"
                      required
                    />
                  </div>

                  <button type="submit" className="button booking-form__submit" disabled={loading}>
                    {loading ? 'Booking...' : 'Book Appointment'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default BookAppointment;
