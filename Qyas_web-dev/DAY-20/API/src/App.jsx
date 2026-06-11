import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    // Removed the outer console.log wrapping the promise chain
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setUsers(response.data);
        console.log("users info", response.data);
        console.log("number of users", response.data.length);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setError("Failed to load users."); // Handles API failures gracefully
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>; // Displays error UI

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.slice(0, 5).map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.email} | Address: {user.address.street}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
