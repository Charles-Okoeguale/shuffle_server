const express = require('express');
const router = express.Router();
const { addUser, getAllUsers, getUserById, editUser, deleteUser } = require('../controllers/addUserController');

router.post('/add', addUser);
router.get('/all', getAllUsers);
router.get('/:id', getUserById);
router.put('/update/:id', editUser);
router.delete('/delete/:id', deleteUser);


module.exports = router;
