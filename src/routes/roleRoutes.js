const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authenticate = require("../../src/middlewares/authenticate")
const checkPermission = require('../../src/middlewares/checkPermission');

router.post('/add', authenticate, roleController.addRole);
router.put('/edit/:id', authenticate, roleController.editRole);
router.delete('/delete/:id', authenticate, roleController.deleteRole);
router.get('/all', authenticate, roleController.getAllRoles);

module.exports = router;
