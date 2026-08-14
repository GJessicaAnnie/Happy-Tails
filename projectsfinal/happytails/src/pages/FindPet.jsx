import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { petService } from '../services/petService';
import './FindPet.css';

function FindPet() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAge, setFilterAge] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');

  // Fetch pets from backend
  useEffect(() => {
    fetchPets();
  }, [filterType, filterAge, filterLocation]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = {
        type: filterType,
        age: filterAge,
        location: filterLocation,
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await petService.getPets(params);
      if (response.success) {
        setPets(response.data.pets);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchPets();
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop&q=80';
    e.target.onerror = null;
  };

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="find-pet-page">
      <Navbar />
      
      <main className="find-pet-main">
        <section className="find-pet-hero">
          <div className="find-pet-hero__content">
            <h1 className="find-pet-hero__title">Find Your Perfect Companion</h1>
            <p className="find-pet-hero__subtitle">
              Browse through our loving pets waiting for their forever homes
            </p>
          </div>
        </section>

        <section className="find-pet-filters">
          <div className="find-pet-filters__inner">
            <div className="find-pet-search">
              <input
                type="text"
                placeholder="Search by pet name or breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="find-pet-search__input"
              />
            </div>

            <div className="find-pet-filter-options">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="find-pet-filter__select"
              >
                <option value="all">All Types</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
              </select>

              <select
                value={filterAge}
                onChange={(e) => setFilterAge(e.target.value)}
                className="find-pet-filter__select"
              >
                <option value="all">All Ages</option>
                <option value="young">Young (0-2 years)</option>
                <option value="adult">Adult (3-5 years)</option>
                <option value="senior">Senior (5+ years)</option>
              </select>

              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="find-pet-filter__select"
              >
                <option value="all">All Locations</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Vijayawada">Vijayawada</option>
                <option value="Visakhapatnam">Visakhapatnam</option>
                <option value="Tirupati">Tirupati</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mysore">Mysore</option>
                <option value="Mangalore">Mangalore</option>
                <option value="Hubli">Hubli</option>
              </select>
            </div>
          </div>
        </section>

        <section className="pets-grid">
          <div className="pets-grid__inner">
            {loading ? (
              <div className="pets-grid__loading">
                <p>Loading pets...</p>
              </div>
            ) : filteredPets.length > 0 ? (
              filteredPets.map(pet => (
                <article key={pet.id} className="pet-card">
                  <div className="pet-card__image-wrap">
                    <img
                      src={pet.image}
                      alt={`${pet.name} the ${pet.breed}`}
                      className="pet-card__image"
                      onError={handleImageError}
                    />
                    <span className={`pet-card__badge pet-card__badge--${pet.type}`}>
                      {pet.type === 'dog' ? '🐶 Dog' : '🐱 Cat'}
                    </span>
                  </div>
                  <div className="pet-card__content">
                    <h3 className="pet-card__name">{pet.name}</h3>
                    <p className="pet-card__breed">{pet.breed}</p>
                    <div className="pet-card__details">
                      <span className="pet-card__detail">🎂 {pet.age}</span>
                      <span className="pet-card__detail">📍 {pet.location}</span>
                    </div>
                    <button 
                      className="button button--primary pet-card__adopt-btn"
                      onClick={() => navigate(`/adopt/${pet._id}?name=${pet.name}&type=${pet.type}&image=${encodeURIComponent(pet.image)}`)}
                    >
                      Adopt {pet.name}
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="pets-grid__no-results">
                <p>😔 No pets found matching your criteria</p>
                <button 
                  className="button button--secondary"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                    setFilterAge('all');
                    setFilterLocation('all');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default FindPet;
