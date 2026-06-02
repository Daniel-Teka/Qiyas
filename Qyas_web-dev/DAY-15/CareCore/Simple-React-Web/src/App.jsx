import { useState } from 'react'
import './App.css'

// Import your logo asset
import logoImg from './assets/logo.png';

// 1. Logo Component
function Logo() {
  return (
    <div className="logo">
      <span>
        <img src={logoImg} alt="CareCore Logo" className="logo-image" />
      </span>
      CareCore
    </div>
  );
}

// 2. Navigation Component
function Nav({ setPage, currentPage }) {
  return (
    <nav>
      <ul className="nav-list">
        <li>
          <button className={currentPage === 'home' ? 'active' : ''} onClick={() => setPage('home')}>
            Home
          </button>
        </li>
        <li>
          <button className={currentPage === 'services' ? 'active' : ''}
            onClick={() => setPage('services')}>
            Services
          </button>
        </li>
        <li>
          <button className={currentPage === 'about' ? 'active' : ''}
           onClick={() => setPage('about')}>
            About system
          </button>
        </li>
        <li>
          <button className={currentPage === 'contact' ? 'active' : ''}
           onClick={() => setPage('contact')}>
            Contact Us
          </button>
        </li>
      </ul>
    </nav>
  )
}

// 3. Header Component
function Header({ setPage, currentPage }) {
  return (
    <header className="header">
      <Logo />
      <Nav setPage={setPage} currentPage={currentPage} />
    </header>
  )
}
/*
// 4. Service Card Component (Required for the Services page to work)
function ServiceCard({ title, description }) {
  return (
    <div className="service-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// 1. Updated ServiceCard to include a form/content area underneath
function ServiceCard({ title, description }) {
  const [email, setEmail] = useState('');

  const handleAction = (e) => {
    e.preventDefault();
    alert(`Inquiry for ${title} sent!`);
    setEmail('');
  };

  return (
    <div className="service-card-wrapper">
      <div className="service-card">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      
      {/* This is the "Something" displayed under each card: A Quick Action Form *//*}
      <div className="service-extra-content">
        <form onSubmit={handleAction} className="mini-form">
          <input 
            type="email" 
            placeholder="Enter email for info" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
*/
function ServiceCard({ title, description, tip, advice }) {
  return (
    <div className="medical-card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-body">
        <p className="description">{description}</p>
        <div className="tip-box">
          <strong>💡 Care Tip:</strong> <span>{tip}</span>
        </div>
      </div>
      <div className="card-footer">
        <p><strong>CareCore Advice:</strong> {advice}</p>
      </div>
    </div>
  );
}


// 5. Main Body Component (Fixed Logic & Syntax)

function MainBody({ currentPage }) {
  if (currentPage === 'services') {
  const medicalServices = [
    { title: "General Consultation", desc: "Routine health check-ups and diagnostic screenings.", tip: "Keep a journal of symptoms before your visit.", advice: "Annual check-ups prevent 60% of chronic illnesses." },
    { title: "Cardiology", desc: "Heart health monitoring and cardiovascular diagnostics.", tip: "Reduce sodium intake to lower blood pressure.", advice: "Early detection is key to managing heart disease." },
    { title: "Pediatrics", desc: "Specialized medical care for infants, children, and adolescents.", tip: "Maintain a strict immunization schedule.", advice: "A child's health foundation is built in the first 5 years." },
    { title: "Dermatology", desc: "Skin, hair, and nail treatments and screenings.", tip: "Always apply SPF 30+ even on cloudy days.", advice: "Check moles monthly for changes in shape or color." },
    { title: "Physical Therapy", desc: "Rehabilitation and strength training for injury recovery.", tip: "Consistency in home exercises speeds up healing.", advice: "Rest is part of the work; don't over-train." },
    { title: "Nutrition & Dietetics", desc: "Personalized meal planning and metabolic health.", tip: "Hydrate with 2L of water daily for better focus.", advice: "Food is medicine; prioritize whole ingredients." },
    { title: "Mental Health", desc: "Counseling and psychological support services.", tip: "Practice 5 minutes of deep breathing daily.", advice: "Mental health is just as important as physical health." },
    { title: "Dental Care", desc: "Preventative cleaning and restorative oral surgery.", tip: "Floss daily to prevent gum inflammation.", advice: "Oral health affects your entire cardiovascular system." },
    { title: "Laboratory Services", desc: "Blood work, pathology, and rapid diagnostic testing.", tip: "Fast for 8-12 hours before metabolic blood tests.", advice: "Numbers don't lie; track your lab trends annually." },
    { title: "Pharmacy Support", desc: "Prescription management and medication counseling.", tip: "Set phone alerts for your medication times.", advice: "Never skip doses without consulting your pharmacist." }
  ];

  return (
    <main className="app-main">
      <div className="services-header">
        <h2>Our Medical Services</h2>
        <p>Professional care tailored to your needs.</p>
      </div>
      <div className="medical-grid">
        {medicalServices.map((service, index) => (
          <ServiceCard 
            key={index}
            title={service.title}
            description={service.desc}
            tip={service.tip}
            advice={service.advice}
          />
        ))}
      </div>
    </main>
  );
}

  if (currentPage === 'about') {
    return (
      <main className="app-main">
        <div className="card">
          <h2>About CareCore v1.0</h2>
          <p>This is a lightweight modular management system.</p>
        </div>
      </main>
    )
  }

  if (currentPage === 'contact') {
    return (
      <main className="app-main">
        <div className="card">
          <h2>Contact Us</h2>
          <p>Email: support@carecore.com</p>
          <p>Phone: +1 (555) 000-2026</p>
        </div>
      </main>
    )
  }

  // Default Fallback: Home Page
  return (
    <main className="app-main">
      <div className="card">
        <h2>Welcome, Trainee</h2>
        <p>This layout uses zero <code>useEffect</code></p>
        <p>Use the navigation above to explore the system.</p>
      </div>
    </main>
  )
}

// 6. Footer Component
function Footer() {
  return (
    <footer className="app-footer">
      <p>&copy; 2026 CareCore Dev Team | Clean Code Onboarding</p>
    </footer>
  )
}

// 7. Main App Component
export default function App() {
  const [currentPage, setPage] = useState('home');

  return (
    <div className="app">
      <Header setPage={setPage} currentPage={currentPage} />
      <MainBody currentPage={currentPage} />
      <Footer />
    </div>
  )
}





















/*

import { useState } from 'react'
import './App.css'

// Import yuor logo asset from the local project
import logoImg from './assets/logo.png';

// 1. Logo Components (with custom setup)
function Logo() {
  return (
    <div className="logo">
      <span>
        <img src={logoImg} alt="CareCore Logo" className="logo-image" />
      </span>
      CareCore
    </div>
  );
}

// 2. Navigation Component
function Nav({ setPage,currentPage }) {
  return (
    <nav>
      <ul className="nav-list">
        <li>
          <button
            className={currentPage === 'home' ? 'active' : ''}
            onClick={() => setPage('home')}
          >
            Home
          </button>
        </li>
        <li>
          <button
            className={currentPage === 'services' ? 'active' : ''}
            onClick={() => setPage('services')}
          >
            Services
          </button>
        </li>
        <li>
          <button
            className={currentPage === 'about' ? 'active' : ''}
            onClick={() => setPage('about')}
          >
            About system
          </button>
        </li>
        <li>
          <button
            className={currentPage === 'contact' ? 'active' : ''}
            onClick={() => setPage('contact')}
          >
            Contact Us
          </button>
        </li>
      </ul>
    </nav>
  )
}

// 3. Header Component
function Header({ setPage, currentPage }) {
  return (
    <header className="header"> 
      <Logo /> 
      <Nav setPage={setPage} currentPage={currentPage} />
    </header>
  )
}

*/
/*
// Full Navigation
function MainBody({ currentPage }) {
  if (currentPage === 'home') {
    return (
      <main className="app-main">
        <div className="card">
          <h2>Welcome, Trainee</h2>
          <p>This layout uses zero <code>useEffect</code></p>
          <p>Click "About System" in the navigation bar above to see more information.</p>
        </div>
      </main>
    )
  }

  if (currentPage === 'services') {
    return (
      <main className="app-main">
        <div className="card">
          <h2>Our Services</h2>
          <ServiceCard title="Service One" description="Description of Service One." />
          <ServiceCard title="Service Two" description="Description of Service Two." />
          <ServiceCard title="Service Three" description="Description of Service Three." />
        </div>
      </main>
    )
  }

  if (currentPage === 'about') {
    return (
      <main className="app-main">
        <div className="card">
          <h2>About CareCore v1.0</h2>
          <p>This is a light waight f.</p>
        </div>
      </main>
    )
  }

  else if (currentPage === 'contact') {
    return (
      <main className="app-main">
        <div className="card">
          <h2>Contact Us</h2>
          <p>Email: support@carecore.com</p>
          <p>Phone: +1 (555) 000-2026</p>
        </div>
      </main>
    )
  }



// 5. Footer Component
function Footer() {
  return (
    <footer className="app-footer">
      <p>&copy; 2026 CareCore Dev Team | Clean code Onboarding</p>
    </footer>
  )
}

// 6. Main App Component
export default function App() {
  const [currentPage, setPage] = useState('home'); // State to manage current page

  return (
    <div className="app">
      <Header setPage={setPage} currentPage={currentPage} />
      <MainBody currentPage={currentPage} />
      <Footer />
    </div>
  )
}}

*/