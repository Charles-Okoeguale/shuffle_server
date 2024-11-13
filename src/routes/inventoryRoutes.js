const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authenticate = require("../../src/middlewares/authenticate")
const checkPermission = require('../../src/middlewares/checkPermission');

router.get('/all', authenticate,  inventoryController.getAllInventory);
router.post('/add', authenticate, checkPermission('inventory.add'), inventoryController.addInventoryItem); 
router.put('/edit/:id', authenticate, checkPermission('inventory.edit'), inventoryController.editInventoryItem);
router.delete('/delete/:id', authenticate, checkPermission('inventory.delete'), inventoryController.deleteItem);
router.post('/confirm-order', authenticate, inventoryController.confirmOrder);

module.exports = router;