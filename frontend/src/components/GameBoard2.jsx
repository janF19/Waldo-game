    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { useNavigate } from 'react-router-dom';
    //import waldoImage from '../assets/waldo1.jpg';

    const GameBoard = ({ gameSessionId, playerName }) => {
        const [targetBox, setTargetBox] = useState(null);
        const [characters, setCharacters] = useState([]);
        const [foundCharacters, setFoundCharacters] = useState([]);
        const [showDropdown, setShowDropdown] = useState(false);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [showInstructions, setShowInstructions] = useState(true);
        const [gameId, setGameId] = useState(null); // Add state for gameId

        const [imageUrl, setImageUrl] = useState(null);
        const navigate = useNavigate();

        useEffect(() => {
            const fetchData = async () => {
              if (!gameSessionId) {
                setError('No game session ID provided');
                setLoading(false);
                return;
              }
        
              try {
                // First get the game session to get the gameId
                const sessionResponse = await axios.get(`http://localhost:5000/api/game-sessions/${gameSessionId}`);
                const fetchedGameId = sessionResponse.data.gameId;
                setGameId(fetchedGameId); // Store the gameId in state
        
                /// Fetch both characters and image URL in parallel
                const [charactersResponse, imageResponse] = await Promise.all([
                  axios.get('http://localhost:5000/api/characters', {
                      params: { gameId: fetchedGameId }
                  }),
                  axios.get(`http://localhost:5000/api/games/${fetchedGameId}/image`)
                  
              ]);



                setCharacters(charactersResponse.data);
                setImageUrl(imageResponse.data.imageUrl)
                setLoading(false);
              } catch (error) {
                console.error('Error fetching characters:', error);
                setError('Failed to load characters');
                setLoading(false);
              }
            };

            
        
            fetchData();
          }, [gameSessionId]);

    
          const handleGameCompletion = async () => {
            try {
              

                if(!gameId) {
                    throw new Error('Game Id is not available now');
                }

                localStorage.setItem('lastPlayerName', playerName);
                localStorage.setItem('lastGameId', gameId); // Store gameId
                
                // Navigate to leaderboard with the player name
                navigate('/leaderboard', { state: { playerName, gameId: parseInt(gameId, 10) } });
                } catch (error) {
                console.error('Error completing game:', error);
                setError('Failed to complete game');
                }
            };



    const handleImageClick = (e) => {
        // Prevent handling if clicking the dropdown
        if (e.target.closest('.character-dropdown')) {
        return;
        }
    
        const rect = e.target.getBoundingClientRect();
        
        // Calculate the basic click coordinates
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Define box dimensions
        const boxWidth = 100;
        const boxHeight = 100;
        
        // Adjust coordinates to center the box (subtract half the box dimensions)
        const centeredX = clickX - (boxWidth / 2);
        const centeredY = clickY - (boxHeight / 2);
        
        // Calculate percentage coordinates based on the click position (not the box position)
        const percentX = (clickX / rect.width) * 100;
        const percentY = (clickY / rect.height) * 100;
    
        // Set target box with centered coordinates
        setTargetBox({
        x: centeredX,
        y: centeredY,
        percentX: percentX,
        percentY: percentY,
        width: boxWidth,
        height: boxHeight
        });
        setShowDropdown(true);
    };
    
    
    
    const handleCharacterSelect = async (character) => {

        if (!targetBox) return;

        
        try {
            const response = await axios.post('http://localhost:5000/api/characters/check-position', {
              characterId: character.id,
              x: targetBox.percentX,
              y: targetBox.percentY,
              gameSessionId: gameSessionId
            });

        if (response.data.found) {
            setFoundCharacters(prev => [...prev, character.id]);
            alert(`You found ${character.name}!`);
            
            if (response.data.gameCompleted) {
              alert('Congratulations! You found all characters!');
              
              handleGameCompletion();
            }
          } else {
            alert('Try again! Not in this location.');
          }
        } catch (error) {
          console.error('Error checking position:', error);
        }
    
        setTargetBox(null);
        setShowDropdown(false);
      };

      if (loading) {
        return <div>Loading game...</div>;
      }
      if (error) return <div>Error: {error}</div>;
     

    const handleOutsideClick = (e) => {
       
        if (!e.target.closest('.targeting-box') && 
            !e.target.matches('img')) {
        setTargetBox(null);
        setShowDropdown(false);
        }
    };
    return (
        <div className="game-container" style={{ padding: '20px' }}>
          {/* Game Header */}
          <div style={{
            background: 'white',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '10px' }}>Welcome, {playerName}!</h2>
            
            {/* Character List */}
            <div style={{ 
              display: 'flex', 
              gap: '20px',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <span>Find these characters:</span>
              <div style={{ 
                display: 'flex', 
                gap: '10px' 
              }}>
                {characters.map(char => (
                  <div
                    key={char.id}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '15px',
                      backgroundColor: foundCharacters.includes(char.id) ? '#4CAF50' : '#f0f0f0',
                      color: foundCharacters.includes(char.id) ? 'white' : 'black'
                    }}
                  >
                    {char.name} {foundCharacters.includes(char.id) && '✓'}
                  </div>
                ))}
              </div>
            </div>
    
            {/* Instructions */}
            {showInstructions && (
              <div style={{
                padding: '10px',
                backgroundColor: '#fff3cd',
                borderRadius: '4px',
                marginBottom: '10px',
                position: 'relative'
              }}>
                <button
                  onClick={() => setShowInstructions(false)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
                <h3 style={{ marginBottom: '5px' }}>How to Play:</h3>
                <ol style={{ margin: '0', paddingLeft: '20px' }}>
                  <li>Look for the characters listed above in the image</li>
                  <li>Click on a character when you find them</li>
                  <li>Select the correct character name from the dropdown</li>
                  <li>Find all characters to complete the game!</li>
                </ol>
              </div>
            )}
          </div>
    
          {/* Game Board */}
          <div style={{ position: 'relative', userSelect: 'none' }}>
          {imageUrl ? (
                    <img 
                        src={imageUrl}
                        onClick={handleImageClick}
                        style={{ 
                            maxWidth: '100%', 
                            cursor: 'crosshair',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                        alt="Where's Waldo"
                        draggable="false"
                    />
                ) : (
                    <div>Loading image...</div>
                )}
            
            {/* Targeting Box and Dropdown (keep existing code) */}
            {targetBox && (
              <div 
                className="targeting-box"
                style={{
                  position: 'absolute',
                  left: `${targetBox.x}px`,
                  top: `${targetBox.y}px`,
                  width: `${targetBox.width}px`,
                  height: `${targetBox.height}px`,
                  border: '2px solid red',
                  backgroundColor: 'rgba(255,0,0,0.2)',
                  pointerEvents: 'none'
                }}
              />
            )}
    
            {showDropdown && targetBox && (
              <div 
                className="character-dropdown"
                style={{
                  position: 'absolute',
                  left: `${targetBox.x + targetBox.width + 5}px`,
                  top: `${targetBox.y}px`,
                  backgroundColor: 'white',
                  padding: '8px',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  zIndex: 1000
                }}
              >
                {characters
                  .filter(char => !foundCharacters.includes(char.id))
                  .map(character => (
                    <div 
                      key={character.id}
                      onClick={() => handleCharacterSelect(character)}
                      style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        ':hover': { backgroundColor: '#f0f0f0' }
                      }}
                    >
                      {character.name}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      );
    };
    
    export default GameBoard;