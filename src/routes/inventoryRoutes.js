const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/all', inventoryController.getAllInventory);
router.post('/add', inventoryController.addInventoryItem); 
router.put('/edit/:id', inventoryController.editInventoryItem);
router.delete('/delete/:id', inventoryController.deleteItem);
router.post('/confirm-order', inventoryController.confirmOrder);

module.exports = router;