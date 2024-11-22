const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authenticate = require("../../src/middlewares/authenticate")
const checkPermission = require('../../src/middlewares/checkPermission');

router.get('/all', authenticate,  inventoryController.getAllInventory);
router.get('/user/:id', authenticate,  inventoryController.getInventoryByUser);
router.post('/add', authenticate,  inventoryController.addInventoryItem); 
router.put('/edit/:id', authenticate, inventoryController.editInventoryItem);
router.delete('/delete/:id', authenticate, inventoryController.deleteItem);
router.post('/confirm-order', authenticate, inventoryController.confirmOrder);
router.get('/orders', authenticate, inventoryController.getAllOrders);
router.get('/:id', authenticate,  inventoryController.getItemById);
router.delete('/orders/delete/:id', authenticate, inventoryController.deleteOrder);

module.exports = router;