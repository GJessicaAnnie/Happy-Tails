require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Pet = require('./models/Pet');
const Appointment = require('./models/Appointment');
const AdoptionApplication = require('./models/AdoptionApplication');

const connectDB = require('./config/database');

// Connect to database
connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Pet.deleteMany({});
    await Appointment.deleteMany({});
    await AdoptionApplication.deleteMany({});

    console.log('Creating users...');
    
    // Create Admin
    const admin = await User.create({
      fullName: 'Admin User',
      email: 'admin@happytails.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9876543210'
    });

    // Create Doctors
    const doctors = await User.create([
      {
        fullName: 'Dr. Priya Sharma',
        email: 'priya@happytails.com',
        password: 'doctor123',
        role: 'doctor',
        specialization: 'Small Animals',
        experience: '8 years',
        rating: 4.8,
        isAvailable: true,
        workingHours: { start: 9, end: 17 },
        phone: '+91 9876543211'
      },
      {
        fullName: 'Dr. Rajesh Kumar',
        email: 'rajesh@happytails.com',
        password: 'doctor123',
        role: 'doctor',
        specialization: 'Large Animals',
        experience: '12 years',
        rating: 4.9,
        isAvailable: true,
        workingHours: { start: 10, end: 18 },
        phone: '+91 9876543212'
      },
      {
        fullName: 'Dr. Anita Patel',
        email: 'anita@happytails.com',
        password: 'doctor123',
        role: 'doctor',
        specialization: 'Birds & Exotic Pets',
        experience: '6 years',
        rating: 4.7,
        isAvailable: true,
        workingHours: { start: 9, end: 16 },
        phone: '+91 9876543213'
      },
      {
        fullName: 'Dr. Vikram Singh',
        email: 'vikram@happytails.com',
        password: 'doctor123',
        role: 'doctor',
        specialization: 'Surgery & Emergency',
        experience: '15 years',
        rating: 5.0,
        isAvailable: false,
        workingHours: { start: 8, end: 20 },
        phone: '+91 9876543214'
      }
    ]);

    // Create Pet Adopters
    const petAdopters = await User.create([
      {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'user123',
        role: 'petadopt',
        phone: '+91 9876543220'
      },
      {
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        password: 'user123',
        role: 'petadopt',
        phone: '+91 9876543221'
      }
    ]);

    console.log('Creating pets...');
    
    // Create Pets
    const pets = await Pet.create([
      {
        name: 'Max',
        breed: 'Golden Retriever',
        type: 'dog',
        age: '2 years',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop&q=80',
        description: 'Friendly and energetic golden retriever looking for a loving home',
        gender: 'male',
        vaccinated: true,
        status: 'available',
        addedBy: admin._id
      },
      {
        name: 'Luna',
        breed: 'Persian',
        type: 'cat',
        age: '1 year',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600&h=600&fit=crop&q=80',
        description: 'Beautiful Persian cat, very calm and affectionate',
        gender: 'female',
        vaccinated: true,
        status: 'available',
        addedBy: admin._id
      },
      {
        name: 'Charlie',
        breed: 'Labrador',
        type: 'dog',
        age: '3 years',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1579296061700-47e0f6e0c500?w=600&h=600&fit=crop&q=80',
        description: 'Loyal Labrador, great with kids',
        gender: 'male',
        vaccinated: true,
        status: 'available',
        addedBy: admin._id
      },
      {
        name: 'Milo',
        breed: 'Siamese',
        type: 'cat',
        age: '6 months',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&h=600&fit=crop&q=80',
        description: 'Playful Siamese kitten, very social',
        gender: 'male',
        vaccinated: false,
        status: 'available',
        addedBy: admin._id
      },
      {
        name: 'Coco',
        breed: 'Cockatiel',
        type: 'bird',
        age: '1 year',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&h=600&fit=crop&q=80',
        description: 'Beautiful cockatiel, loves to sing',
        gender: 'female',
        vaccinated: true,
        status: 'available',
        addedBy: admin._id
      },
      {
        name: 'Bella',
        breed: 'Beagle',
        type: 'dog',
        age: '4 years',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&h=600&fit=crop&q=80',
        description: 'Gentle Beagle, perfect family dog',
        gender: 'female',
        vaccinated: true,
        status: 'available',
        addedBy: admin._id
      },
      {
        name: 'Rocky',
        breed: 'German Shepherd',
        type: 'dog',
        age: '2.5 years',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=600&h=600&fit=crop&q=80',
        description: 'Intelligent and protective German Shepherd',
        gender: 'male',
        vaccinated: true,
        status: 'available',
        addedBy: admin._id
      },
      {
        name: 'Thumper',
        breed: 'Holland Lop',
        type: 'rabbit',
        age: '8 months',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=600&fit=crop&q=80',
        description: 'Adorable Holland Lop rabbit, very friendly',
        gender: 'male',
        vaccinated: true,
        status: 'available',
        addedBy: admin._id
      },
      {
        name: 'Kitty',
        breed: 'Maine Coon',
        type: 'cat',
        age: '2 years',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&h=600&fit=crop&q=80',
        description: 'Majestic Maine Coon, gentle giant',
        gender: 'female',
        vaccinated: true,
        status: 'available',
        addedBy: admin._id
      },
      {
        name: 'Buddy',
        breed: 'Pomeranian',
        type: 'dog',
        age: '1.5 years',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1529429612779-c8e40df2f5ce?w=600&h=600&fit=crop&q=80',
        description: 'Fluffy Pomeranian, very active and playful',
        gender: 'male',
        vaccinated: true,
        status: 'available',
        addedBy: admin._id
      }
    ]);

    console.log('Creating sample appointments...');
    
    // Create sample appointments
    await Appointment.create([
      {
        vetName: doctors[0].fullName,
        vetId: doctors[0]._id,
        userId: petAdopters[0]._id,
        date: new Date('2026-04-26'),
        timeSlot: '10:00 AM',
        ownerName: petAdopters[0].fullName,
        petName: 'Max',
        petType: 'Dog',
        contactNumber: petAdopters[0].phone,
        reason: 'Regular checkup and vaccination',
        status: 'pending'
      },
      {
        vetName: doctors[1].fullName,
        vetId: doctors[1]._id,
        userId: petAdopters[1]._id,
        date: new Date('2026-04-27'),
        timeSlot: '2:00 PM',
        ownerName: petAdopters[1].fullName,
        petName: 'Luna',
        petType: 'Cat',
        contactNumber: petAdopters[1].phone,
        reason: 'Skin allergy consultation',
        status: 'confirmed'
      }
    ]);

    console.log('Creating sample adoption applications...');
    
    // Create sample adoption applications
    await AdoptionApplication.create([
      {
        petId: pets[0]._id,
        userId: petAdopters[0]._id,
        fullName: petAdopters[0].fullName,
        addressLine1: '123 Main Street',
        addressLine2: 'Apt 4B',
        phone: petAdopters[0].phone,
        email: petAdopters[0].email,
        occupation: 'Software Engineer',
        livingSituation: 'Family',
        familyApproval: 'Yes',
        houseType: 'Own',
        landlordPermission: 'Yes',
        priorPetExperience: 'Yes',
        dailyWalkCommitment: '2-4 hours',
        hoursPetAlone: '2-6 hours',
        backupCaretaker: 'Jane Doe - +91 9876543221',
        adoptionReason: 'I want to provide a loving home to Max',
        financialReadiness: 'Yes',
        vetAccess: 'Yes',
        agreeToCare: true,
        status: 'pending'
      }
    ]);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('Admin: admin@happytails.com / admin123');
    console.log('Doctor: priya@happytails.com / doctor123');
    console.log('User: john@example.com / user123');
    console.log('\n📊 Summary:');
    console.log(`- Admin users: 1`);
    console.log(`- Doctors: ${doctors.length}`);
    console.log(`- Pet Adopters: ${petAdopters.length}`);
    console.log(`- Pets: ${pets.length}`);
    console.log(`- Appointments: 2`);
    console.log(`- Adoption Applications: 1`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
