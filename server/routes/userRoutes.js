const express = require('express');
const { addUser, getUsers, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.post('/', addUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
