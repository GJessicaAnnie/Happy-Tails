import { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import './About.css';

function About() {
  const [activeTab, setActiveTab] = useState(0);

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=600&fit=crop&q=80';
    e.target.onerror = null;
  };

  const values = [
    {
      id: 1,
      title: 'Compassionate Care 💚',
      description: 'Every pet deserves love and attention. We ensure each animal receives the care they need.',
      highlights: [
        'Personalized attention for every animal',
        'Safe and supportive environment',
        'Emotional bonding support'
      ]
    },
    {
      id: 2,
      icon: '🤝',
      title: 'Trust & Transparency',
      description: 'We build trust through honest communication and transparent adoption processes.',
      highlights: [
        'Clear adoption procedures',
        'Complete medical history disclosure',
        'Ongoing support and communication'
      ]
    },
    {
      id: 3,
      icon: '🏠',
      title: 'Forever Homes',
      description: 'Our mission is to match every pet with a loving, permanent family.',
      highlights: [
        'Careful family-pet matching process',
        'Home environment assessments',
        'Lifetime adoption support'
      ]
    },
    {
      id: 4,
      icon: '🩺',
      title: 'Health First',
      description: 'All our pets receive complete veterinary care before adoption.',
      highlights: [
        'Comprehensive health screenings',
        'Up-to-date vaccinations',
        'Spay/neuter services included'
      ]
    },
    {
      id: 5,
      icon: '👥',
      title: 'Community Support',
      description: 'We support adopters with resources and guidance throughout their journey.',
      highlights: [
        '24/7 emergency support hotline',
        'Free training workshops',
        'Active online community forums'
      ]
    },
    {
      id: 6,
      icon: '🌟',
      title: 'Excellence',
      description: 'We strive for the highest standards in pet welfare and adoption services.',
      highlights: [
        'Certified veterinary partnerships',
        'Industry-leading care protocols',
        'Continuous improvement programs'
      ]
    }
  ];

  const rescueStories = [
    {
      id: 1,
      name: 'Max & Sarah',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      story: 'Max was found abandoned in a parking lot. After months of rehabilitation, Sarah adopted him and they became inseparable.',
      detail: 'Adopted 2023'
    },
    {
      id: 2,
      name: 'Luna & Mike',
      image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=600&q=80',
      story: 'Luna was rescued from an overcrowded shelter. Mike knew she was the one the moment they met. Now they hike together every weekend.',
      detail: 'Adopted 2022'
    },
    {
      id: 3,
      name: 'Bella & Emma',
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=600&q=80',
      story: 'Bella was a stray with a broken leg. Emma fostered her during recovery and decided to keep her forever. Best decision ever!',
      detail: 'Adopted 2024'
    },
    {
      id: 4,
      name: 'Charlie & David',
      image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80',
      story: 'Charlie was surrendered when his owner moved abroad. David, a veteran, found companionship and healing in this gentle soul.',
      detail: 'Adopted 2023'
    },
    {
      id: 5,
      name: 'Milo & Lisa',
      image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=600&q=80',
      story: 'Milo was born with a disability. Lisa specializes in special-needs cats and knew Milo would be perfect for her family.',
      detail: 'Adopted 2024'
    }
  ];

  return (
    <div className="about-page">
      <Navbar />
      
      <main className="about-main">
        <section className="about-hero">
          <div className="about-hero__content">
            <h1 className="about-hero__title">About HappyTails</h1>
            <p className="about-hero__subtitle">
              Connecting loving families with pets in need. We believe every animal deserves a second chance at happiness.
            </p>
          </div>
        </section>

        <section className="about-mission">
          <div className="about-mission__inner">
            <div className="about-mission__content">
              <h2 className="about-mission__title">Our Mission</h2>
              <p className="about-mission__text">
                At HappyTails, we're dedicated to reducing pet homelessness by creating meaningful connections between animals and families. 
                Our platform streamlines the adoption process, making it easier than ever to find your perfect companion.
              </p>
              <p className="about-mission__text">
                We work closely with shelters, rescue organizations, and veterinary professionals to ensure every pet is healthy, 
                vaccinated, and ready for their forever home. Our comprehensive support system helps adopters through every step of the journey.
              </p>
            </div>
            <div className="about-mission__image">
              <img 
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80" 
                alt="Happy dog with family"
                onError={handleImageError}
              />
            </div>
          </div>
        </section>

        <section className="about-values">
          <div className="about-values__inner">
            <h2 className="about-values__title">Our Values</h2>
            <p className="about-values__subtitle">
              The principles that guide everything we do
            </p>
            <div className="values-list">
              {values.map((value, index) => (
                <button
                  key={value.id}
                  className={`value-list-item ${activeTab === index ? 'value-list-item--active' : ''}`}
                  onClick={() => setActiveTab(index)}
                  type="button"
                >
                  <span className="value-list-item__icon">{value.icon}</span>
                  <span className="value-list-item__title">{value.title}</span>
                </button>
              ))}
            </div>
            <div className="values-layout">
              <div className="values-layout__main">
                <div className="values-main-card" key={activeTab}>
                  <div className="values-main-card__icon">{values[activeTab].icon}</div>
                  <h3 className="values-main-card__title">{values[activeTab].title}</h3>
                  <p className="values-main-card__description">{values[activeTab].description}</p>
                  <ul className="values-main-card__highlights">
                    {values[activeTab].highlights.map((highlight, idx) => (
                      <li key={idx} className="values-main-card__highlight">
                        <span className="highlight-bullet">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="values-layout__image">
                <img 
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80" 
                  alt="Happy pets playing"
                  onError={handleImageError}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="about-stories">
          <div className="about-stories__inner">
            <h2 className="about-stories__title">Rescue Stories</h2>
            <p className="about-stories__subtitle">
              Real journeys of love and second chances
            </p>
            <div className="stories-scroll">
              <div className="stories-track">
                {[...rescueStories, ...rescueStories].map((story, index) => (
                  <div key={`${story.id}-${index}`} className="story-card">
                    <div className="story-card__image-wrap">
                      <img src={story.image} alt={story.name} className="story-card__image" onError={handleImageError} />
                    </div>
                    <div className="story-card__content">
                      <p className="story-card__story">{story.story}</p>
                      <div className="story-card__footer">
                        <h3 className="story-card__name">{story.name}</h3>
                        <span className="story-card__detail">{story.detail}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main> 

      <Footer />
    </div>
  );
}

export default About;
