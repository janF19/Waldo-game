
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();




exports.getLeaderBoard = async (req, res) => {
    
    try {

        const { gameId } = req.query; // Get gameId from query parameters
        
        if (!gameId) {
            return res.status(400).json({ error: 'Game ID is required' });
        }


        const leaderboard = await prisma.$queryRaw`
         SELECT id, "player_name", "startTime", "endTime", 
             EXTRACT(EPOCH FROM (COALESCE("endTime", NOW()) - "startTime")) AS duration 
      FROM "GameSession"
      WHERE completed = true
      AND "game_id" = ${parseInt(gameId)}
      ORDER BY duration ASC 
      LIMIT 10
        `;
        // Calculate duration for each session
    const leaderboardWithDuration = leaderboard.map(session => ({
        ...session,
        duration: session.endTime - session.startTime,
        player_name: session.player_name
      }));
  
      res.json(leaderboardWithDuration);

    } catch (error) {
        console.error('Error fetching leaderboard,:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard, something is wrong' });
    }

}


exports.updateLeaderBoard = async (req, res) => {

}