// routes/issues.js
const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const issueCtrl = require('../controllers/issueController');

// Issue a book
router.post('/issue', auth, issueCtrl.issueBook);

// Return a book
router.post('/return', auth, issueCtrl.returnBook);

// Student self-checkout
router.post('/self-checkout', auth, issueCtrl.selfCheckout);

// Student self-return
router.post('/self-return', auth, issueCtrl.selfReturn);

// Get all transactions (optional)
router.get('/transactions', auth, issueCtrl.getTransactions);
// Logged-in student's transactions
router.get('/my', auth, issueCtrl.getMyTransactions);

module.exports = router;
