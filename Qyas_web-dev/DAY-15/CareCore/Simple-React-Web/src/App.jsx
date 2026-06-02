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
function Nav({ set,currentPage }) {
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
            className={currentPage === 'about' ? 'active' : ''}
            onClick={() => setPage('about')}
          >
            About System
          </button>
        </li>
      </ul>
    </nav>
  )
}

// 3. Header Component
function Header({ setPage,currentPage }) {
  return (
    <header className="header">
      <Logo />
      <Nav setPage={setPage} currentPage={currentPage} />
    </header>
  )
}

// 4. Main Body Component (Handles simple conditional views without useEffect)
function MainBody({ currentPage }) {
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

  // Default Fallback : Home Page
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
}