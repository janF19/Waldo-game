const prisma = require('../utils/prismaClient'); 

require('dotenv').config();



exports.createGameSession = async (req, res) => {
  const { playerName, gameId } = req.body;

  try {
    // Validate input
    if (!playerName || !gameId) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Player name and game ID are required'
      });
    }

    // First check if the game exists
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        characters: true
      }
    });

    if (!game) {
      return res.status(404).json({ 
        error: 'Game not found',
        details: `No game found with ID ${gameId}`
      });
    }

    // Create new game session
    const gameSession = await prisma.gameSession.create({
      data: {
        playerName,
        gameId,
        startTime: new Date(),
        completed: false
      }
    });

    res.status(201).json({
      id: gameSession.id,
      playerName: gameSession.playerName,
      startTime: gameSession.startTime,
      message: 'Game session created successfully'
    });

  } catch (error) {
    console.error('Error creating game session:', error);
    res.status(500).json({ 
      error: 'Failed to create game session',
      details: error.message
    });
  }
};

// Optional: Get active session
exports.getGameSession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await prisma.gameSession.findUnique({
      where: { id: parseInt(sessionId) },
      include: {
        game: true,
        characterFinds: true
      }
    });

    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found',
        details: `No session found with ID ${sessionId}`
      });
    }

    res.json(session);

  } catch (error) {
    console.error('Error fetching game session:', error);
    res.status(500).json({ 
      error: 'Failed to fetch game session',
      details: error.message
    });
  }
};


exports.getAllGames = async (req, res) => {
  console.log('Entering getAllGames method');

  
  try {
    console.log('Attempting to fetch games from database...');
    const games = await prisma.game.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
        difficulty: true
      }
    });
    
    console.log('Games fetched successfully:', games);
    
    if (!games || games.length === 0) {
      console.log('No games found in database');
      return res.json([]); // Return empty array instead of error if no games exist
    }
    
    res.json(games);
  } catch (error) {
    console.error('Detailed error in getAllGames:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    
    res.status(500).json({ 
      error: 'Failed to fetch games',
      details: error.message,
      code: error.code
    });
  }
};

exports.getImageUrl = async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // Convert gameId to integer since URL params are strings
    const gameIdInt = parseInt(gameId, 10);
    
    // Validate gameId is a number
    if (isNaN(gameIdInt)) {
      return res.status(400).json({
        error: 'Invalid game ID',
        details: 'Game ID must be a number'
      });
    }

    // Find the game using Prisma
    const game = await prisma.game.findUnique({
      where: {
        id: gameIdInt
      },
      select: {
        imageUrl: true
      }
    });

    // Check if game exists
    if (!game) {
      return res.status(404).json({
        error: 'Game not found',
        details: `No game found with ID ${gameId}`
      });
    }

    // Check if imageUrl exists
    if (!game.imageUrl) {
      return res.status(404).json({
        error: 'Image not found',
        details: `No image URL found for game with ID ${gameId}`
      });
    }

    // Return the image URL
    res.json({
      imageUrl: game.imageUrl
    });

  } catch (error) {
    console.error('Error fetching game image:', error);
    res.status(500).json({
      error: 'Failed to fetch game image',
      details: error.message
    });
  }
};