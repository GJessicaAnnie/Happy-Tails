import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './RescueCare.css';

function RescueCare() {
  const navigate = useNavigate();

  const rescueStories = [
    {
      id: 1,
      title: 'Max\'s Journey from Streets to Sweet Dreams',
      excerpt: 'Found shivering on a cold winter night, Max now sleeps in a warm bed with a loving family.',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop&q=80',
      category: 'Rescue'
    },
    {
      id: 2,
      title: 'Luna\'s Recovery: From Injury to Joy',
      excerpt: 'After months of dedicated care, Luna overcame her injuries and found her forever home.',
      image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&h=600&fit=crop&q=80',
      category: 'Recovery'
    },
    {
      id: 3,
      title: 'Charlie: The Survivor Who Stole Hearts',
      excerpt: 'This brave pup survived against all odds and now brings happiness to everyone he meets.',
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&h=600&fit=crop&q=80',
      category: 'Adoption'
    },
    {
      id: 4,
      title: 'Bella\'s Second Chance at Life',
      excerpt: 'Abandoned and scared, Bella learned to trust again with the help of our volunteers.',
      image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&h=600&fit=crop&q=80',
      category: 'Rescue'
    },
    {
      id: 5,
      title: 'Rocky\'s Road to Rehabilitation',
      excerpt: 'From malnourished stray to healthy, happy companion - Rocky\'s inspiring transformation.',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127e54a?w=800&h=600&fit=crop&q=80',
      category: 'Recovery'
    },
    {
      id: 6,
      title: 'Milo: The Tiny Fighter with Big Dreams',
      excerpt: 'This little kitten proved that size doesn\'t matter when you have a fighting spirit.',
      image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=600&fit=crop&q=80',
      category: 'Adoption'
    }
  ];

  const ngos = [
    {
      id: 1,
      name: 'Paws & Hope Foundation',
      description: 'Dedicated to rescuing and rehabilitating street animals across the city.',
      logo: '🐾',
      impact: '2,500+ animals rescued'
    },
    {
      id: 2,
      name: 'Furry Friends Rescue',
      description: 'Providing medical care and shelter for abandoned pets since 2015.',
      logo: '🏥',
      impact: '1,800+ medical treatments'
    },
    {
      id: 3,
      name: 'Street Paws Alliance',
      description: 'Community-driven initiative to feed and care for street animals.',
      logo: '❤️',
      impact: '15,000+ meals served'
    },
    {
      id: 4,
      name: 'Animal Welfare Society',
      description: 'Working towards humane treatment and adoption of stray animals.',
      logo: '🤝',
      impact: '3,200+ successful adoptions'
    }
  ];

  const careTips = [
    {
      id: 1,
      icon: '🍖',
      title: 'Proper Nutrition',
      description: 'Feed your pet balanced meals appropriate for their age and breed.',
      color: '#e8f8f6'
    },
    {
      id: 2,
      icon: '💧',
      title: 'Hydration is Key',
      description: 'Always ensure fresh, clean water is available for your pet.',
      color: '#e3f2fd'
    },
    {
      id: 3,
      icon: '🏃',
      title: 'Regular Exercise',
      description: 'Daily physical activity keeps your pet healthy and happy.',
      color: '#fff3e0'
    },
    {
      id: 4,
      icon: '🏥',
      title: 'Vet Check-ups',
      description: 'Schedule regular health check-ups to catch issues early.',
      color: '#fce4ec'
    },
    {
      id: 5,
      icon: '🛁',
      title: 'Grooming Care',
      description: 'Regular grooming prevents skin issues and keeps coat healthy.',
      color: '#f3e5f5'
    },
    {
      id: 6,
      icon: '💝',
      title: 'Love & Attention',
      description: 'Spend quality time with your pet to build a strong bond.',
      color: '#e8f5e9'
    },
    {
      id: 7,
      icon: '💉',
      title: 'Vaccination Care',
      description: 'Keep vaccinations up to date to protect your pet from diseases.',
      color: '#e0f7fa'
    },
    {
      id: 8,
      icon: '🏠',
      title: 'Safe Environment',
      description: 'Ensure a clean, safe and comfortable living space for your pet.',
      color: '#f1f8e9'
    }
  ];

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=600&fit=crop&q=80';
    e.target.onerror = null;
  };

  return (
    <div className="rescue-page">
      <Navbar />

      {/* Hero Section */}
      <section className="rescue-hero">
        <div className="rescue-hero__blobs">
          <div className="rescue-hero__blob rescue-hero__blob--1"></div>
          <div className="rescue-hero__blob rescue-hero__blob--2"></div>
          <div className="rescue-hero__blob rescue-hero__blob--3"></div>
        </div>
        <div className="rescue-hero__content">
          <h1 className="rescue-hero__title">Rescue. Care. Protect.</h1>
          <p className="rescue-hero__subtitle">
            Every animal deserves a loving home. Join us in making a difference, one life at a time.
          </p>
          <div className="rescue-hero__buttons">
            <button 
              className="button rescue-hero__button rescue-hero__button--primary"
              onClick={() => navigate('/find-pet')}
              type="button"
            >
              Adopt Now
            </button>
            <button 
              className="button rescue-hero__button rescue-hero__button--secondary"
              type="button"
            >
              Become a Volunteer
            </button>
          </div>
        </div>
      </section>

      {/* Featured Rescue Story */}
      <section className="featured-story">
        <div className="featured-story__inner">
          <div className="featured-story__card">
            <div className="featured-story__image-wrap">
              <img
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&h=800&fit=crop&q=80"
                alt="Featured rescue story"
                className="featured-story__image"
                onError={handleImageError}
              />
              <div className="featured-story__image-overlay"></div>
            </div>
            <div className="featured-story__content">
              <span className="featured-story__badge">Featured Story</span>
              <h2 className="featured-story__title">From Abandoned to Adored: Sarah's Story</h2>
              <p className="featured-story__description">
                Found alone on the streets, scared and malnourished, Sarah's transformation is nothing short of miraculous. 
                Through dedicated care, medical attention, and lots of love, she went from a timid stray to a confident, 
                joyful companion. Her journey reminds us that every rescue has the potential for a beautiful ending.
              </p>
              <button className="button featured-story__button" type="button">
                Read Full Story →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NGO Collaboration */}
      <section className="ngo-section">
        <div className="ngo-section__inner">
          <div className="section-header">
            <h2 className="section-header__title">Our NGO Partners</h2>
            <p className="section-header__subtitle">
              Collaborating with organizations making a real difference
            </p>
          </div>
          <div className="ngo-grid">
            {ngos.map(ngo => (
              <div key={ngo.id} className="ngo-card">
                <div className="ngo-card__icon">{ngo.logo}</div>
                <h3 className="ngo-card__name">{ngo.name}</h3>
                <p className="ngo-card__description">{ngo.description}</p>
                <div className="ngo-card__impact">{ngo.impact}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rescue Stories */}
      <section className="stories-section">
        <div className="stories-section__inner">
          <div className="section-header">
            <h2 className="section-header__title">Rescue Stories</h2>
            <p className="section-header__subtitle">
              Real stories of hope, recovery, and love
            </p>
          </div>
          <div className="stories-grid">
            {rescueStories.map(story => (
              <article key={story.id} className="story-card">
                <div className="story-card__image-wrap">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="story-card__image"
                    onError={handleImageError}
                  />
                  <span className="story-card__category">{story.category}</span>
                </div>
                <div className="story-card__content">
                  <h3 className="story-card__title">{story.title}</h3>
                  <p className="story-card__excerpt">{story.excerpt}</p>
                  <button className="story-card__link" type="button">
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pet Care Tips */}
      <section className="tips-section">
        <div className="tips-section__inner">
          <div className="section-header">
            <h2 className="section-header__title">Pet Care Essentials</h2>
            <p className="section-header__subtitle">
              Expert tips to keep your furry friend healthy and happy
            </p>
          </div>
          <div className="tips-grid">
            {careTips.map(tip => (
              <div key={tip.id} className="tip-card" style={{ backgroundColor: tip.color }}>
                <div className="tip-card__icon">{tip.icon}</div>
                <h3 className="tip-card__title">{tip.title}</h3>
                <p className="tip-card__description">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default RescueCare;
