import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { contactService } from '../services/contactService';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await contactService.submitMessage(formData);
      if (response.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', email: '', subject: '', message: '' });
          setIsModalOpen(false);
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSubmitted(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <Navbar />
      
      <main className="contact-main">
        <section className="contact-hero">
          <div className="contact-hero__content">
            <h1 className="contact-hero__title">Get in Touch</h1>
            <p className="contact-hero__subtitle">
              Have questions about adoption? We're here to help you find your perfect companion
            </p>
          </div>
        </section>

        <section className="contact-content">
          <div className="contact-content__inner">
            {/* Top Section: 2-Column Layout */}
            <div className="contact-info-map-grid">
              {/* LEFT SIDE: Contact Information Card */}
              <div className="contact-info-card">
                <h2 className="contact-info-card__title">Contact Information</h2>
                
                <div className="contact-info-item">
                  <div className="contact-info-item__icon">📍</div>
                  <div className="contact-info-item__content">
                    <h3>Visit Us</h3>
                    <p>HappyTails Pet Care</p>
                    <p>Near AP Secretariat Road</p>
                    <p>VIT-AP University Area</p>
                    <p>Inavolu, Amaravati – 522237</p>
                    <p>Andhra Pradesh, India</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-item__icon">📧</div>
                  <div className="contact-info-item__content">
                    <h3>Email Us</h3>
                    <p>hello@happytails.in</p>
                    <p>support@happytails.in</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-item__icon">📞</div>
                  <div className="contact-info-item__content">
                    <h3>Call Us</h3>
                    <p>+91 91234 56789</p>
                    <p>Mon - Fri: 9 AM - 6 PM</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-item__icon">⏰</div>
                  <div className="contact-info-item__content">
                    <h3>Working Hours</h3>
                    <p>Monday - Friday: 9 AM - 6 PM</p>
                    <p>Saturday: 10 AM - 4 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Google Map */}
              <div className="contact-map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.618141752976!2d80.49906279999999!3d16.4948622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f27d40f21c55%3A0x1490eacd54859850!2sVIT-AP%20University!5e0!3m2!1sen!2sin!4v1776267300216!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                  className="contact-map-iframe"
                />
              </div>
            </div>

            {/* Form Section Removed - Now using floating button */}
          </div>
        </section>
      </main>

      {/* Floating Contact Button */}
      <button className="contact-floating-btn" onClick={openModal} type="button">
        <span className="contact-floating-btn__icon">✉️</span>
        <span className="contact-floating-btn__text">Contact Us</span>
      </button>

      {/* Contact Modal */}
      {isModalOpen && (
        <div className="contact-modal-overlay" onClick={closeModal}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <button className="contact-modal__close" onClick={closeModal} type="button">
              ✕
            </button>
            
            <h2 className="contact-modal__title">Send us a Message</h2>
            
            {submitted ? (
              <div className="contact-modal__success">
                <div className="contact-modal__success-icon">✓</div>
                <h3>Thank you!</h3>
                <p>Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            ) : (
              <form className="contact-modal__form" onSubmit={handleSubmit}>
                <div className="contact-modal__group">
                  <label htmlFor="modal-name" className="contact-modal__label">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="modal-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="contact-modal__input"
                    placeholder="John Doe"
                  />
                </div>

                <div className="contact-modal__group">
                  <label htmlFor="modal-email" className="contact-modal__label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="modal-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="contact-modal__input"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="contact-modal__group">
                  <label htmlFor="modal-subject" className="contact-modal__label">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="modal-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="contact-modal__input"
                    placeholder="How can we help?"
                  />
                </div>

                <div className="contact-modal__group">
                  <label htmlFor="modal-message" className="contact-modal__label">
                    Your Message *
                  </label>
                  <textarea
                    id="modal-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="contact-modal__textarea"
                    placeholder="Tell us more about your inquiry..."
                    rows="5"
                  />
                </div>

                <button type="submit" className="button button--primary contact-modal__submit">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Contact;
