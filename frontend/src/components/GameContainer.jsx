import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameBoard from './GameBoard2';
import GameStart from './GameStart';

const GameContainer = () => {
  const [gameState, setGameState] = useState({
    gameSessionId: null,
    playerName: '',
    gameId: null, // Add gameId to state
    gameStarted: false
  });


  const location = useLocation();

  // Check for state from Leaderboard "Play Again"
  useEffect(() => {
    if (location.state?.fromLeaderboard) {
      const { gameSessionId, playerName, gameId } = location.state;
      setGameState({
        gameSessionId,
        playerName,
        gameId,
        gameStarted: true
      });
    }
  }, [location]);


  const handleGameStart = (sessionId, name, gameId) => {
    setGameState({
      gameSessionId: sessionId,
      playerName: name,
      gameId: gameId,
      gameStarted: true
    });
  };

  if (!gameState.gameStarted) {
    // Pass stored player name to GameStart if available
    return <GameStart 
      onGameStart={handleGameStart} 
      initialPlayerName={location.state?.playerName || ''} 
    />;
  }

  return (
    <GameBoard 
      gameSessionId={gameState.gameSessionId} 
      playerName={gameState.playerName}
      gameId={gameState.gameId}
    />
  );
};

export default GameContainer;