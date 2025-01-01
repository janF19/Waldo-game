const express = require('express');
const router = express.Router();
const { getAllCharacters,  checkCharacterPosition } = require('../controllers/characterController');

router.get('/', getAllCharacters);
router.post('/check-position', checkCharacterPosition);

module.exports = router;