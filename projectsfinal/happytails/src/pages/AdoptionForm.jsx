import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { adoptionService } from '../services/adoptionService';
import './AdoptionForm.css';

function AdoptionForm() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [slideDirection, setSlideDirection] = useState('next');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop&q=80';
    e.target.onerror = null;
  };

  // Get pet data from URL params
  const petData = {
    id: petId,
    name: searchParams.get('name') || 'Unknown Pet',
    image: searchParams.get('image') || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&q=80',
    type: searchParams.get('type') || 'Dog'
  };

  const [formData, setFormData] = useState({
    // Step 1 - Personal Details
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    phone: '',
    email: '',
    occupation: '',
    
    // Step 2 - Living Situation
    livingSituation: '',
    familyApproval: '',
    houseType: '',
    landlordPermission: '',
    priorPetExperience: '',
    dailyWalkCommitment: '',
    hoursPetAlone: '',
    backupCaretaker: '',
    
    // Step 3 - Pet Care Readiness
    adoptionReason: '',
    financialReadiness: '',
    vetAccess: '',
    agreeToCare: false
  });

  // Check authentication and petId on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (!petId) {
      setError('Pet ID is missing. Please go back and select a pet.');
    }
  }, [isAuthenticated, navigate, petId]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Enter a valid phone number';
      }
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Enter a valid email';
      }
      if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
    }

    if (step === 2) {
      if (!formData.livingSituation) newErrors.livingSituation = 'Select living situation';
      if (!formData.familyApproval) newErrors.familyApproval = 'Select family approval';
      if (!formData.houseType) newErrors.houseType = 'Select house type';
      if (formData.houseType === 'Rented' && !formData.landlordPermission) {
        newErrors.landlordPermission = 'Landlord permission is required';
      }
      if (!formData.priorPetExperience) newErrors.priorPetExperience = 'Select experience';
      if (!formData.dailyWalkCommitment) newErrors.dailyWalkCommitment = 'Select walk commitment';
      if (!formData.hoursPetAlone) newErrors.hoursPetAlone = 'Select hours';
      if (!formData.backupCaretaker.trim()) newErrors.backupCaretaker = 'Backup caretaker is required';
    }

    if (step === 3) {
      if (!formData.adoptionReason.trim()) newErrors.adoptionReason = 'Please share your reason';
      else if (formData.adoptionReason.trim().length < 20) {
        newErrors.adoptionReason = 'Please provide at least 20 characters';
      }
      if (!formData.financialReadiness) newErrors.financialReadiness = 'Select financial readiness';
      if (!formData.vetAccess) newErrors.vetAccess = 'Select vet access';
      if (!formData.agreeToCare) newErrors.agreeToCare = 'You must agree to care for the pet';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setSlideDirection('next');
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setSlideDirection('prev');
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!petId) {
      setError('Pet ID is missing. Please go back and select a pet.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const applicationData = {
        petId,
        ...formData
      };

      // Remove landlordPermission if houseType is 'Own'
      if (formData.houseType === 'Own') {
        delete applicationData.landlordPermission;
      }

      console.log('Submitting application:', applicationData);

      const response = await adoptionService.submitApplication(applicationData);
      
      if (response.success) {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Application submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: 'Personal Details' },
      { number: 2, label: 'Living Situation' },
      { number: 3, label: 'Pet Care Readiness' }
    ];

    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
      <div className="stepper">
        <div className="stepper__progress">
          <div 
            className="stepper__progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="stepper__steps">
          {steps.map((step, index) => (
            <div key={step.number} className="stepper__step">
              <div className={`stepper__circle ${
                currentStep > step.number ? 'stepper__circle--completed' :
                currentStep === step.number ? 'stepper__circle--active' : ''
              }`}>
                {currentStep > step.number ? (
                  <span className="stepper__check">✓</span>
                ) : (
                  <span className="stepper__number">{step.number}</span>
                )}
              </div>
              <span className={`stepper__label ${
                currentStep === step.number ? 'stepper__label--active' : ''
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`stepper__line ${
                  currentStep > step.number ? 'stepper__line--completed' : ''
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInput = (label, name, type = 'text', placeholder = '', required = true) => (
    <div className="form-group">
      <label htmlFor={name} className="form-group__label">
        {label} {required && <span className="form-group__required">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={`form-group__input ${errors[name] ? 'form-group__input--error' : ''}`}
        placeholder={placeholder}
      />
      {errors[name] && <span className="form-group__error">{errors[name]}</span>}
    </div>
  );

  const renderSelect = (label, name, options, placeholder = 'Select an option') => (
    <div className="form-group">
      <label htmlFor={name} className="form-group__label">
        {label} <span className="form-group__required">*</span>
      </label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={`form-group__select ${errors[name] ? 'form-group__select--error' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {errors[name] && <span className="form-group__error">{errors[name]}</span>}
    </div>
  );

  const renderTextarea = (label, name, placeholder, rows = 4) => (
    <div className="form-group">
      <label htmlFor={name} className="form-group__label">
        {label} <span className="form-group__required">*</span>
      </label>
      <textarea
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={`form-group__textarea ${errors[name] ? 'form-group__textarea--error' : ''}`}
        placeholder={placeholder}
        rows={rows}
      />
      {errors[name] && <span className="form-group__error">{errors[name]}</span>}
    </div>
  );

  const renderCheckbox = (label, name) => (
    <div className="form-group form-group--checkbox">
      <label className="form-group__checkbox-label">
        <input
          type="checkbox"
          name={name}
          checked={formData[name]}
          onChange={handleChange}
          className="form-group__checkbox"
        />
        <span className="form-group__checkbox-custom"></span>
        <span className="form-group__checkbox-text">{label}</span>
      </label>
      {errors[name] && <span className="form-group__error">{errors[name]}</span>}
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="adoption-page">
        <Navbar />
        <main className="adoption-main">
          <div className="adoption-container">
            <div className="adoption-card adoption-card--success">
              <div className="success-animation">
                <div className="success-icon">✓</div>
              </div>
              <h1 className="success-title">Application Submitted!</h1>
              <p className="success-subtitle">
                Thank you for applying to adopt <strong>{petData.name}</strong>
              </p>
              <div className="success-details">
                <p>We'll review your application and get back to you within 48 hours.</p>
                <p className="success-note">Our team will contact you at {formData.email} or {formData.phone}.</p>
              </div>
              <div className="success-buttons">
                <button 
                  className="button success-button"
                  onClick={() => navigate('/find-pet')}
                  type="button"
                >
                  Browse More Pets
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="adoption-page">
      <Navbar />
      
      <main className="adoption-main">
        <div className="adoption-container">
          <div className="adoption-card">
            {/* Pet Info Header */}
            <div className="pet-header">
              <img 
                src={petData.image} 
                alt={petData.name} 
                className="pet-header__image"
                onError={handleImageError}
              />
              <div className="pet-header__content">
                <span className="pet-header__badge">Adopting</span>
                <h1 className="pet-header__name">{petData.name}</h1>
                <p className="pet-header__type">{petData.type}</p>
              </div>
            </div>

            {/* Stepper */}
            {renderStepIndicator()}

            {/* Form */}
            <form className="adoption-form" onSubmit={handleSubmit}>
              <div className={`form-step ${
                currentStep === 1 ? 'form-step--active' : 
                currentStep > 1 ? 'form-step--completed' : 'form-step--hidden'
              } ${slideDirection === 'next' ? 'form-step--slide-next' : 'form-step--slide-prev'}`}>
                {currentStep === 1 && (
                  <>
                    <h2 className="form-step__title">Personal Details</h2>
                    {renderInput('Full Name', 'fullName', 'text', 'John Doe')}
                    {renderInput('Address Line 1', 'addressLine1', 'text', '123 Main Street')}
                    {renderInput('Address Line 2', 'addressLine2', 'text', 'Apt 4B (Optional)', false)}
                    {renderInput('Phone Number', 'phone', 'tel', '+91 91234 56789')}
                    {renderInput('Email Address', 'email', 'email', 'your.email@example.com')}
                    {renderInput('Occupation', 'occupation', 'text', 'Software Engineer')}
                    <button type="button" className="button form-button form-button--primary" onClick={nextStep}>
                      Continue →
                    </button>
                  </>
                )}
              </div>

              <div className={`form-step ${
                currentStep === 2 ? 'form-step--active' : 
                currentStep > 2 ? 'form-step--completed' : 'form-step--hidden'
              } ${slideDirection === 'next' ? 'form-step--slide-next' : 'form-step--slide-prev'}`}>
                {currentStep === 2 && (
                  <>
                    <h2 className="form-step__title">Living Situation</h2>
                    {renderSelect('Living Situation', 'livingSituation', [
                      { value: 'Alone', label: 'Living Alone' },
                      { value: 'Family', label: 'With Family' },
                      { value: 'Roommates', label: 'With Roommates' }
                    ])}
                    {renderSelect('Family Approval', 'familyApproval', [
                      { value: 'Yes', label: 'Yes, everyone agrees' },
                      { value: 'No', label: 'Not applicable / No' }
                    ])}
                    {renderSelect('House Type', 'houseType', [
                      { value: 'Own', label: 'Owned House' },
                      { value: 'Rented', label: 'Rented Apartment/House' }
                    ])}
                    {formData.houseType === 'Rented' && 
                      renderSelect('Landlord Permission', 'landlordPermission', [
                        { value: 'Yes', label: 'Yes, I have permission' },
                        { value: 'No', label: 'No permission yet' }
                      ])
                    }
                    {renderSelect('Prior Pet Experience', 'priorPetExperience', [
                      { value: 'Yes', label: 'Yes, I have experience' },
                      { value: 'No', label: 'No, first-time owner' }
                    ])}
                    {renderSelect('Daily Walk Commitment', 'dailyWalkCommitment', [
                      { value: '1-2 hours', label: '1-2 hours' },
                      { value: '2-4 hours', label: '2-4 hours' },
                      { value: '4+ hours', label: '4+ hours' }
                    ])}
                    {renderSelect('Hours Pet Alone', 'hoursPetAlone', [
                      { value: '0-2 hours', label: '0-2 hours' },
                      { value: '2-6 hours', label: '2-6 hours' },
                      { value: '6+ hours', label: '6+ hours' }
                    ])}
                    {renderInput('Backup Caretaker', 'backupCaretaker', 'text', 'Name & contact of backup person')}
                    <div className="form-buttons">
                      <button type="button" className="button form-button form-button--secondary" onClick={prevStep}>
                        ← Back
                      </button>
                      <button type="button" className="button form-button form-button--primary" onClick={nextStep}>
                        Continue →
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className={`form-step ${
                currentStep === 3 ? 'form-step--active' : 'form-step--hidden'
              } ${slideDirection === 'next' ? 'form-step--slide-next' : 'form-step--slide-prev'}`}>
                {currentStep === 3 && (
                  <>
                    <h2 className="form-step__title">Pet Care Readiness</h2>
                    {renderTextarea('Reason for Adoption', 'adoptionReason', 'Tell us why you want to adopt and how you plan to care for this pet...')}
                    {renderSelect('Financial Readiness', 'financialReadiness', [
                      { value: 'Yes', label: 'Yes, I can afford pet care' },
                      { value: 'No', label: 'Not sure yet' }
                    ])}
                    {renderSelect('Vet Access', 'vetAccess', [
                      { value: 'Yes', label: 'Yes, I have a vet nearby' },
                      { value: 'No', label: 'No vet identified yet' }
                    ])}
                    {renderCheckbox('I agree to provide proper care, nutrition, medical attention, and love for this pet.', 'agreeToCare')}
                    
                    {error && (
                      <div className="auth-error" style={{ marginBottom: '20px', padding: '12px' }}>
                        <span>⚠️</span> {error}
                      </div>
                    )}
                    
                    <div className="form-buttons">
                      <button type="button" className="button form-button form-button--secondary" onClick={prevStep}>
                        ← Back
                      </button>
                      <button type="submit" className="button form-button form-button--submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Application ✓'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdoptionForm;
