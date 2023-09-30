const express = require('express');
const { postNotFoundHandler } = require('../controllers/not-found');

const router = express.Router();

router.post('/', postNotFoundHandler);

module.exports = router;
