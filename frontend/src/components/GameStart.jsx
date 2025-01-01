


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GameBoard from './GameBoard2';

import { useLocation } from 'react-router-dom';

const GameStart = ({ onGameStart }) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedGame, setSelectedGame] = useState(1);
  const [games, setGames] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();



    // Fetch available games on component mount
    useEffect(() => {
      const fetchGames = async () => {
        try {
          console.log('Fetching games...');
          const response = await axios.get('http://localhost:5000/api/games');
          console.log('Games response:', response.data);
          setGames(response.data);
        } catch (error) {
          console.error('Detailed error fetching games:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
          setError(`Failed to load available games: ${error.response?.data?.details || error.message}`);
        }
      };
      fetchGames();
    }, []);






  useEffect(() => {
    const savedName = location.state?.playerName || localStorage.getItem('lastPlayerName');
    const savedGameId = location.state?.gameId || localStorage.getItem('lastGameId');
    
    if (savedName) {
      setPlayerName(savedName);
      if (savedGameId) setSelectedGame(parseInt(savedGameId, 10));
      
      if (location.state?.fromLeaderboard) {
        handleSubmit(new Event('submit'));
      }
    }
  }, [location.state]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/game-sessions', {
        playerName: playerName.trim(),
        gameId: selectedGame // Beach scene game
      });

       // Store player name for future use
       localStorage.setItem('lastPlayerName', playerName.trim());
       localStorage.setItem('lastGameId', 1);
       onGameStart(response.data.id, playerName, selectedGame);

      
    } catch (error) {
      console.error('Error starting game:', error);
      setError('Failed to start game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Where's Waldo?</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Player Name Input */}
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="playerName"
              style={{ display: 'block', marginBottom: '0.5rem' }}
            >
              Enter your name to start
            </label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          {/* Game Selection */}
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="gameSelect"
              style={{ display: 'block', marginBottom: '0.5rem' }}
            >
              Select a Scene
            </label>
            <select
              id="gameSelect"
              value={selectedGame}
              onChange={(e) => setSelectedGame(parseInt(e.target.value, 10))}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              {games.map(game => (
                <option key={game.id} value={game.id}>
                  {game.name} ({game.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              color: 'red',
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: '#fff5f5',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Starting Game...' : 'Start Game'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GameStart;
