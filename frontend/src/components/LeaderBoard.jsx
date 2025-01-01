
import React, { useState, useEffect } from 'react'; // Importing React and hooks
import axios from 'axios'; // Importing axios for API calls // Importing formatDuration from the appropriate library
import { useNavigate, useLocation } from 'react-router-dom'; // Importing useNavigate for navigation


const formatDuration = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };



const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const playerName = location.state?.playerName || localStorage.getItem('lastPlayerName');
    const gameId = location.state?.gameId || localStorage.getItem('lastGameId');

    useEffect(() => {
        const fetchLeaderboard = async () => {
          if (!gameId) {
            setError('No game ID provided');
            setLoading(false);
            return;
        }

          try {
            const response = await axios.get('http://localhost:5000/api/leaderboard',{
              params: {gameId}
            });
            setLeaderboard(response.data);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching leaderboard:', error);
            setError('Failed to load leaderboard');
            setLoading(false);
          }
        };
    
        fetchLeaderboard();
      }, [gameId]);


      const handlePlayAgain = async () => {
        const storedGameId = localStorage.getItem('lastGameId');
        const numericGameId = parseInt(storedGameId, 10); // Convert to number

        if (!playerName || !numericGameId || isNaN(numericGameId)) {
            console.error('Missing or invalid playerName or gameId:', { 
                playerName, 
                storedGameId,
                numericGameId 
              });
            console.error('New feature issue');
          navigate('/');
          return;
        }
    
        try {
          // Create a new game session
            const response = await axios.post('http://localhost:5000/api/game-sessions', {
                playerName,
                gameId: numericGameId // send as number
            });
        
          // Store the new session information
          localStorage.setItem('lastPlayerName', playerName);
          localStorage.setItem('lastGameId', numericGameId);
    
          // Navigate to the game board with the new session
          navigate('/', {
            state: {
              fromLeaderboard: true,
              gameSessionId: response.data.id,
              playerName: playerName,
              gameId: numericGameId
            }
          });
        } catch (error) {
          console.error('Error creating new game session:', error);

          if (error.response) {
            console.error('Error response:', error.response.data);
          }

          setError('Failed to start new game');
        }
      };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div className="leaderboard">
          <h2>Top Players - Game {gameId}</h2>
          {leaderboard.length > 0 ? (
              <table>
                  <thead>
                      <tr>
                          <th>Rank</th>
                          <th>Player</th>
                          <th>Time</th>
                      </tr>
                  </thead>
                  <tbody>
                      {leaderboard.map((entry, index) => (
                          <tr key={entry.id} className={entry.player_name === playerName ? 'current-player' : ''}>
                              <td>{index + 1}</td>
                              <td>{entry.player_name}</td>
                              <td>{formatDuration(entry.duration)}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          ) : (
              <p>No scores yet for this game!</p>
          )}
          <button onClick={handlePlayAgain}>Play Again</button>
      </div>
  );
};

export default Leaderboard;
