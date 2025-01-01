import { useState } from 'react'

import GameBoard2 from './components/GameBoard2';
import GameContainer from './components/GameContainer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Leaderboard from './components/LeaderBoard' // Make sure this path is correct
import './App.css'


import './App.css'



function App() {
  return (
    <div className="App">
       <Router>
      <Routes>
        <Route path="/" element={<GameContainer />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        {/* any other routes you need */}
      </Routes>
    </Router>
    </div>
  );
}

export default App