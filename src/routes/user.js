const express = require('express');
const router = express.Router();
const { addUser, getAllUsers, getUserById, editUser, deleteUser } = require('../controllers/addUserController');
const authenticate = require("../../src/middlewares/authenticate")
const checkPermission = require('../../src/middlewares/checkPermission');

router.post('/add', authenticate, checkPermission('user.add'), addUser);
router.get('/all', authenticate, getAllUsers);
router.get('/:id', authenticate, getUserById);
router.put('/update/:id', authenticate, checkPermission('user.edit'), editUser);
router.delete('/delete/:id', authenticate, checkPermission('user.delete'), deleteUser);


module.exports = router;
