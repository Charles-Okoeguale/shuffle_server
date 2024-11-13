const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

router.get('/', statisticsController.getAllStatistics);
router.post('/add', statisticsController.addStatistic);


module.exports = router;
