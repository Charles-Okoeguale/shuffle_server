const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.post('/add', roleController.addRole);
router.put('/edit/:id', roleController.editRole);
router.delete('/delete/:id', roleController.deleteRole);

module.exports = router;
