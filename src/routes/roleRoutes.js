const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authenticate = require("../../src/middlewares/authenticate")
const checkPermission = require('../../src/middlewares/checkPermission');

router.post('/add', authenticate, roleController.addRole);
router.put('/edit/:id', authenticate, checkPermission('roles.edit'), roleController.editRole);
router.delete('/delete/:id', authenticate, checkPermission('roles.delete'), roleController.deleteRole);
router.get('/all', authenticate, roleController.getAllRoles);

module.exports = router;
