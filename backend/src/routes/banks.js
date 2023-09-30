const express = require('express');
const { getBanksHandler } = require('../controllers/banks');

const router = express.Router();

router.get('/', getBanksHandler);

module.exports = router;
