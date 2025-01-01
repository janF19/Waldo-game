
const express = require('express');
const router = express.Router();
const { createGameSession, getGameSession, completeGameSession, getAllGames, getImageUrl } = require('../controllers/gameSessionController');

// Create new game session
router.post('/game-sessions', createGameSession);


router.get('/games', getAllGames)

// Get game session by ID
router.get('/game-sessions/:sessionId', getGameSession);

//router.get('/game-sessions/:sessionId/complete', completeGameSession)

router.get('/games/:gameId/image', getImageUrl)



module.exports = router;