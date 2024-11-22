const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const authenticate = require("../../src/middlewares/authenticate")
const checkPermission = require('../../src/middlewares/checkPermission');

router.get('/', authenticate, statisticsController.getAllStatistics);
router.post('/add', authenticate, checkPermission('statistics.add'), statisticsController.addStatistic);
router.get('/rates', authenticate, statisticsController.getRates);


module.exports = router;
