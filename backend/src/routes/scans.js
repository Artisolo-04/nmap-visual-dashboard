const express = require('express');

const router = express.Router();

const { runScan, getScans, getScanById, compareScans } = require('../controllers/scanController');

router.post('/', runScan);
router.get('/', getScans);
router.get('/compare', compareScans);
router.get('/:id', getScanById);

module.exports = router;
