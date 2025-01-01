require('dotenv').config();
const express = require('express');
const cors = require('cors');

const characterRoutes = require('./routes/characterRoutes');
const gameSessionRoutes = require('./routes/gameSessionRoutes');  
const gameLeaderBoardRoutes = require('./routes/gameLeaderBoardRoutes')

const app = express();


// Allow all origins in development
app.use(cors({
    origin: 'http://localhost:5173' // Vite default port
  }));

  
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/characters', characterRoutes);
app.use('/api', gameSessionRoutes);
app.use('/api/leaderboard', gameLeaderBoardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

