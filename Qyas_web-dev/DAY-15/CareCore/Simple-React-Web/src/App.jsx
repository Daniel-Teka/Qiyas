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
          <button className={currentPage === 'services' ? 'active' : ''} onClick={() => setPage('services')}>
            Services
          </button>
        </li>
        <li>
          <button className={currentPage === 'about' ? 'active' : ''} onClick={() => setPage('about')}>
            About system
          </button>
        </li>
        <li>
          <button className={currentPage === 'contact' ? 'active' : ''} onClick={() => setPage('contact')}>
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

// 4. Service Card Component (Required for the Services page to work)
function ServiceCard({ title, description }) {
  return (
    <div className="service-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// 5. Main Body Component (Fixed Logic & Syntax)
function MainBody({ currentPage }) {
  if (currentPage === 'services') {
    return (
      <main className="app-main">
        <div className="card">
          <h2>Our Services</h2>
          <div className="services-list">
            <ServiceCard title="Health Analytics" description="Advanced data tracking." />
            <ServiceCard title="Admin Portal" description="Manage institutional users." />
            <ServiceCard title="Cloud Sync" description="Secure automated backups." />
          </div>
        </div>
      </main>
    )
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