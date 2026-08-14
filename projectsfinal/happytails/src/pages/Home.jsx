import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    adopted: 0,
    shelters: 0,
    lovers: 0
  });

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80';
    e.target.onerror = null;
  };

  // Animate counters
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      setStats({
        adopted: Math.floor(2500 * progress),
        shelters: Math.floor(45 * progress),
        lovers: Math.floor(1800 * progress)
      });
      
      if (current >= steps) {
        clearInterval(timer);
        setStats({ adopted: 2500, shelters: 45, lovers: 1800 });
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const services = [
    {
      id: 1,
      icon: '🐾',
      title: 'Adopt',
      description: 'Find your perfect companion'
    },
    {
      id: 2,
      icon: '🏥',
      title: 'Vet Care',
      description: 'Expert veterinary services'
    },
    {
      id: 3,
      icon: '❤️',
      title: 'Support Strays',
      description: 'Help animals in need'
    },
    {
      id: 4,
      icon: '💡',
      title: 'Pet Care Tips',
      description: 'Learn pet care basics'
    }
  ];

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      petImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80',
      review: 'Adopting Max was the best decision! HappyTails made the process so smooth and supportive.',
      rating: 5
    },
    {
      id: 2,
      name: 'Mike Chen',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      petImage: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=150&q=80',
      review: 'Found my perfect companion Luna. The team was incredibly helpful throughout the adoption.',
      rating: 4
    },
    {
      id: 3,
      name: 'Emma Davis',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      petImage: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=150&q=80',
      review: 'The stray support program is amazing. Volunteering here has been so rewarding!',
      rating: 5
    },
    {
      id: 4,
      name: 'David Wilson',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      petImage: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=150&q=80',
      review: 'Excellent vet care services. They truly care about the animals wellbeing.',
      rating: 4
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      petImage: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=150&q=80',
      review: 'HappyTails changed my life. My rescue dog brings so much joy every day!',
      rating: 5
    }
  ];

  return (
    <div className="home-page">
      <Navbar />

      <section className="hero" id="home">
        <div className="hero__inner">
          <div className="hero__text">
            <div className="hero__eyebrow">Adopt a new best friend</div>
            <h1 className="hero__title">Bring Home Happiness Today</h1>
            <p className="hero__subtitle">
              Meet affectionate companions ready for their forever families.
              Adopt with heart and give a pet a fresh start.
            </p>
            <div className="hero__buttons">
              <button className="button button--accent" type="button" onClick={() => navigate('/find-pet')}>Adopt Now</button>
              <button className="button button--outline-light" type="button">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      <section className="three-cards-section">
        <div className="three-cards__inner">
          <div className="three-cards__card three-cards__services">
            <h2 className="three-cards__title">What We Offer</h2>
            <div className="services-grid">
              {services.map(service => (
                <div key={service.id} className="service-item">
                  <div className="service-item__icon">{service.icon}</div>
                  <h3 className="service-item__title">{service.title}</h3>
                  <p className="service-item__description">{service.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="three-cards__card three-cards__stats">
            <h2 className="three-cards__title">Our Impact</h2>
            <div className="compact-stats-grid">
              <div className="compact-stat">
                <span className="compact-stat__icon">🐾</span>
                <p className="compact-stat__value">{stats.adopted.toLocaleString()}+</p>
                <p className="compact-stat__label">Pets Adopted</p>
              </div>
              <div className="compact-stat">
                <span className="compact-stat__icon">🏠</span>
                <p className="compact-stat__value">{stats.shelters}+</p>
                <p className="compact-stat__label">Shelters</p>
              </div>
              <div className="compact-stat">
                <span className="compact-stat__icon">👥</span>
                <p className="compact-stat__value">{stats.lovers.toLocaleString()}+</p>
                <p className="compact-stat__label">Users</p>
              </div>
              <div className="compact-stat">
                <span className="compact-stat__icon">✨</span>
                <p className="compact-stat__value">92%</p>
                <p className="compact-stat__label">Success Rate</p>
              </div>
            </div>
          </div>

          <div className="three-cards__card three-cards__stray">
            <div className="stray-highlight__content">
              <span className="stray-highlight__icon">❤️</span>
              <h2 className="stray-highlight__title">Support Street Animals</h2>
              <div className="stray-mini-cards">
                <div className="stray-mini-card">
                  <span className="stray-mini-card__icon">🍖</span>
                  <p className="stray-mini-card__title">Food Support</p>
                </div>
                <div className="stray-mini-card">
                  <span className="stray-mini-card__icon">🏥</span>
                  <p className="stray-mini-card__title">Medical Care</p>
                </div>
                <div className="stray-mini-card">
                  <span className="stray-mini-card__icon">🏠</span>
                  <p className="stray-mini-card__title">Shelter Help</p>
                </div>
              </div>
              <button className="button button--accent" type="button">Help Now</button>
            </div>
          </div>
        </div>
      </section>

      <section className="reviews-section">
        <h2 className="section-title">What Our Community Says</h2>
        <p className="section-subtitle">Real stories from happy pet parents</p>
        <div className="reviews-scroll">
          <div className="reviews-track">
            {[...reviews, ...reviews].map((review, index) => (
              <div key={`${review.id}-${index}`} className="review-card">
                <div className="review-card__header">
                  <img src={review.image} alt={review.name} className="review-card__avatar" onError={handleImageError} />
                  <div className="review-card__info">
                    <h3 className="review-card__name">{review.name}</h3>
                    <img src={review.petImage} alt="Pet" className="review-card__pet" onError={handleImageError} />
                  </div>
                </div>
                <p className="review-card__text">{review.review}</p>
                <div className="review-card__stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
