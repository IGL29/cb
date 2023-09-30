const express = require('express');
const { postLoginHandler } = require('../controllers/login');

const router = express.Router();

router.post('/', postLoginHandler);

module.exports = router;
