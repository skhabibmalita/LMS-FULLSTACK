const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const reservationCtrl = require('../controllers/reservationController');

// Create reservation (requires auth)
router.post('/', auth, reservationCtrl.createReservation);
// Get my reservations
router.get('/my', auth, reservationCtrl.getMyReservations);

module.exports = router;
