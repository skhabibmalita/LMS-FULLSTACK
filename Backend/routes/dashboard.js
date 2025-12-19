// routes/dashboard.js
const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const dashboardCtrl = require('../controllers/dashboardController');

// Get dashboard stats
router.get('/stats', auth, dashboardCtrl.getDashboardStats);

module.exports = router;
