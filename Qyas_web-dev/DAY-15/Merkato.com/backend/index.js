const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route (Fixes the "Cannot GET /" error)
app.get('/', (req, res) => {
  res.send('✅ Merkato API Server is running! Go to /api to see data, or open your frontend on port 5173.');
});

// Test API route
app.get('/api', (req, res) => {
  res.json({ message: "Hello from Merkato.com backend! 🚀" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
