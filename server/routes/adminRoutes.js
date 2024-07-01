const express = require('express');
const { loginAdmin, getAdmins } = require('../controllers/adminControllers');
const router = express.Router();

router.post('/login', loginAdmin);
router.get('/', getAdmins);

module.exports = router;
