const express = require('express');
const router = express.Router();
const utilsController = require('../controllers/utilsController');

router.get('/generate-password', utilsController.generate);

module.exports = router;
