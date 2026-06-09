import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('Connecting to backend...')

  // This runs when the page loads to fetch data from the backend
  useEffect(() => {OOOO
    // We use localhost:5000 because that's where our backend is running
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((error) => {
        console.error('Error connecting:', error)
        setMessage('Failed to connect to backend.')
      })
  }, [])

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to Merkato.com 🛒</h1>
      <p>Your React frontend is working perfectly!</p>
      
      <div style={{ marginTop: '20px', padding: '20px', background: '#f4f4f4', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
        <h3>Backend Connection Test:</h3>
        <p style={{ fontSize: '1.2em', color: 'green', fontWeig