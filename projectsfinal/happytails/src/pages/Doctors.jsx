import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { userService } from '../services/userService';
import './Doctors.css';

function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await userService.getDoctors();
      if (response.success) {
        setDoctors(response.data.doctors);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop&q=80';
    e.target.onerror = null;
  };

  return (
    <div className="doctors-page">
      <Navbar />
      
      <main className="doctors-main">
        <section className="doctors-hero">
          <div className="doctors-hero__content">
            <h1 className="doctors-hero__title">Expert Veterinarians</h1>
            <p className="doctors-hero__subtitle">
              Connect with experienced veterinary professionals dedicated to your pet's health and wellbeing
            </p>
          </div>
        </section>

        <section className="doctors-grid">
          <div className="doctors-grid__inner">
            {loading ? (
              <p>Loading doctors...</p>
            ) : (
              doctors.map(doctor => (
              <article key={doctor.id} className="doctor-card">
                <div className="doctor-card__image-wrap">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="doctor-card__image"
                    onError={handleImageError}
                  />
                  <span className={`doctor-card__status ${doctor.available ? 'doctor-card__status--available' : 'doctor-card__status--unavailable'}`}>
                    {doctor.available ? '● Available' : '● Unavailable'}
                  </span>
                </div>
                <div className="doctor-card__content">
                  <h3 className="doctor-card__name">{doctor.name}</h3>
                  <p className="doctor-card__specialization">{doctor.specialization}</p>
                  <div className="doctor-card__details">
                    <div className="doctor-card__detail">
                      <span className="doctor-card__icon">💼</span>
                      <span>{doctor.experience} experience</span>
                    </div>
                    <div className="doctor-card__detail">
                      <span className="doctor-card__icon">⭐</span>
                      <span>{doctor.rating}/5.0 rating</span>
                    </div>
                  </div>
                  <button 
                    className={`button doctor-card__book-btn ${!doctor.available ? 'doctor-card__book-btn--disabled' : ''}`}
                    disabled={!doctor.available}
                    onClick={() => doctor.available && navigate('/book-appointment')}
                  >
                    {doctor.available ? 'Book Appointment' : 'Currently Unavailable'}
                  </button>
                </div>
              </article>
            ))
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Doctors;
