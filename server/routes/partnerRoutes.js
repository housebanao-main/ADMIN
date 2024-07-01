const express = require('express');
const { addPartner, getPartners, updatePartner, deletePartner } = require('../controllers/partnerController');

const router = express.Router();

router.post('/', addPartner);
router.get('/', getPartners);
router.put('/:id', updatePartner);
router.delete('/:id', deletePartner);

module.exports = router;
