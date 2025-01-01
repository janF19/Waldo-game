

  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  require('dotenv').config();

  exports.getAllCharacters = async (req, res) => {
    const { gameId } = req.query;

    if (!gameId) {
      return res.status(400).json({ error: 'Game ID is required' });
    }
    
    try {
      const characters = await prisma.character.findMany({
        where: {
          gameId: parseInt(gameId)
        },
        select: {
          id: true,
          name: true,
         
        }
      });
      res.json(characters);
    } catch (error) {
      console.error('Error fetching characters:', error);
      res.status(500).json({ error: 'Failed to fetch characters' });
    }
  };


  exports.checkCharacterPosition = async (req, res) => {
    console.log('Received click data:', req.body);
    const { characterId, x, y, gameSessionId } = req.body;
    
    try {
      // Get character position data
    const charId = parseInt(characterId);
    const sessionId = parseInt(gameSessionId);

    if (isNaN(charId) || isNaN(sessionId)) {
      return res.status(400).json({ 
        error: 'Invalid ID format',
        details: 'Character ID and game session ID must be integers'
      });
    }



      const character = await prisma.character.findUnique({
        where: { id: charId}
      });

      if (!character) {
        return res.status(404).json({ found: false, message: 'Character not found' });
      }

      // Check if character was already found in this session
      const existingFind = await prisma.characterFind.findFirst({
        where: {
          characterId: charId,
        gameSessionId: sessionId
        }
      });

      if (existingFind) {
        return res.json({ found: false, message: 'Character already found' });
      }

      // Define tolerance for click precision (in percentage points)
      const POSITION_TOLERANCE = 5;

      // Check if click is within character boundaries (with tolerance)
      const isFound = 
        x >= (character.xPositionStart - POSITION_TOLERANCE) &&
        x <= (character.xPositionEnd + POSITION_TOLERANCE) &&
        y >= (character.yPositionStart - POSITION_TOLERANCE) &&
        y <= (character.yPositionEnd + POSITION_TOLERANCE);

      if (isFound) {
        // Record the find
        await prisma.characterFind.create({
          data: {
            characterId: charId,
          gameSessionId: sessionId
          }
        });

        // Check if all characters in the game have been found
        const gameSession = await prisma.gameSession.findUnique({
          where: { id: sessionId },
          include: {
            game: {
              include: {
                characters: true
              }
            },
            characterFinds: true
          }
        });

        const gameCompleted = gameSession.characterFinds.length === gameSession.game.characters.length;

      if (gameCompleted) {
        await prisma.gameSession.update({
          where: { id: sessionId },
          data: {
            completed: true,
            endTime: new Date()
          }
        });
      }

      res.json({ found: true, gameCompleted });
    } else {
      res.json({ found: false });
    }
  } catch (error) {
    console.error('Error checking character position:', error);
    res.status(500).json({ error: 'Position check failed', details: error.message });
  }
};