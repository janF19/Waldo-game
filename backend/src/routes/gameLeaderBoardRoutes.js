const express = require('express');
const router = express.Router();

const { getLeaderBoard, updateLeaderBoard } = require('../controllers/leaderBoardController');

router.get('/', getLeaderBoard);

router.post('/update', updateLeaderBoard);


module.exports = router;



