const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authenticate = require("../../src/middlewares/authenticate")
const checkPermission = require('../../src/middlewares/checkPermission');

router.post('/add', authenticate, checkPermission('Role', 'add'), roleController.addRole);
router.put('/edit/:id', authenticate, checkPermission('Role', 'edit'), roleController.editRole);
router.delete('/delete/:id', authenticate, checkPermission('Role', 'delete'), roleController.deleteRole);

module.exports = router;
