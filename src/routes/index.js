const express = require('express');

const authRoutes = require('./authRoutes');
const userRoutes = require('./user')

const router = express.Router();

router.use('/login', authRoutes);
router.use('/user', userRoutes);

module.exports = router;
