// routes/members.js
const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const memberCtrl = require('../controllers/memberController');

// Get all members
router.get('/', auth, memberCtrl.getMembers);

// Add a new member
router.post('/', auth, memberCtrl.createMember);

// Update existing member
router.put('/:id', auth, memberCtrl.updateMember);

// Delete member
router.delete('/:id', auth, memberCtrl.deleteMember);

module.exports = router;
