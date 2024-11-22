const express = require('express');

const authRoutes = require('./authRoutes');
const userRoutes = require('./user')
const statsRoutes = require('./statisticsRoutes');
const inventoryRoutes = require("./inventoryRoutes")
const roleRoutes = require("./roleRoutes")

const router = express.Router();

router.use('/login', authRoutes);
router.use('/user', userRoutes)
router.use('/statistics', statsRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/roles', roleRoutes);

module.exports = router;
