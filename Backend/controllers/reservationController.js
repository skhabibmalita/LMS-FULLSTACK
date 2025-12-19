const Reservation = require('../models/reservation');
const Book = require('../models/book');
const Member = require('../models/member');

exports.createReservation = async (req, res) => {
  try {
    const { bookId, memberId } = req.body;
    if (!bookId || !memberId) {
      return res.status(400).json({ message: 'bookId and memberId are required' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    // Only allow reservation if out of stock
    if ((book.availableQuantity ?? 0) > 0) {
      return res.status(400).json({ message: 'Book currently available; no reservation needed' });
    }

    const existing = await Reservation.findOne({ bookId, memberId, status: 'pending' });
    if (existing) {
      return res.status(400).json({ message: 'You already have a pending reservation for this book' });
    }

    const reservation = new Reservation({ bookId, memberId });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    console.error('createReservation error:', err.message);
    res.status(500).json({ message: 'Failed to create reservation' });
  }
};

exports.getMyReservations = async (req, res) => {
  try {
    const { id, email } = req.user || {};
    if (!id) return res.status(401).json({ message: 'Unauthorized' });

    // Find member similar to issues my endpoint
    const User = require('../models/user');
    const Member = require('../models/member');
    const userDoc = await User.findById(id);
    let member = null;
    if (userDoc && userDoc.memberId) member = await Member.findById(userDoc.memberId);
    if (!member && email) member = await Member.findOne({ email });
    if (!member) return res.status(404).json({ message: 'Member record not found for user' });

    const reservations = await Reservation.find({ memberId: member._id })
      .populate('bookId')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    console.error('getMyReservations error:', err.message);
    res.status(500).json({ message: 'Failed to fetch reservations' });
  }
};
